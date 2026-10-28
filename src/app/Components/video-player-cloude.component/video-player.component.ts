import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  input,
  signal,
  viewChild,
} from '@angular/core';

export interface VideoSource {
  /** Label shown in the menu, e.g. "1080px" */
  label: string;
  /** Video URL (mp4 / webm) */
  src: string;
}

type MenuName = 'speed' | 'quality' | null;

@Component({
  selector: 'app-video-player',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block outline-none',
    tabindex: '0',
    '(keydown)': 'onKeydown($event)',
    '(document:fullscreenchange)': 'isFullscreen.set(!!document.fullscreenElement)',
    '(document:click)': 'onDocumentClick($event)',
  },
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css'],
})
export class VideoPlayerComponent {
  /** One entry per quality, e.g. [{label:'1080px', src:'...'}, ...] */
  readonly sources = input.required<VideoSource[]>();
  readonly poster = input<string>('');
  /** Label of the quality to start with. Defaults to the first source. */
  readonly defaultQuality = input<string>('');

  protected readonly document = document;
  protected readonly speeds = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  private readonly videoRef = viewChild.required<ElementRef<HTMLVideoElement>>('video');
  private readonly containerRef = viewChild.required<ElementRef<HTMLDivElement>>('container');

  // Playback state
  protected readonly playing = signal(false);
  protected readonly buffering = signal(false);
  protected readonly currentTime = signal(0);
  protected readonly duration = signal(0);
  protected readonly volume = signal(1);
  protected readonly muted = signal(false);
  protected readonly speed = signal(1);
  protected readonly isFullscreen = signal(false);

  // UI state
  protected readonly openMenu = signal<MenuName>(null);
  protected readonly controlsVisible = signal(true);

  // Quality
  private readonly chosenQuality = signal<string | null>(null);
  protected readonly selectedQuality = computed(
    () => this.chosenQuality() ?? (this.defaultQuality() || this.sources()[0]?.label || ''),
  );
  protected readonly currentSrc = computed(
    () => this.sources().find((s) => s.label === this.selectedQuality())?.src ?? '',
  );

  // Restores position / state after a quality switch
  private pending: { time: number; resume: boolean } | null = null;
  private hideTimer?: ReturnType<typeof setTimeout>;

  // ---- Actions --------------------------------------------------------

  protected togglePlay(): void {
    const v = this.videoRef().nativeElement;
    v.paused ? void v.play() : v.pause();
  }

  protected skip(seconds: number): void {
    const v = this.videoRef().nativeElement;
    v.currentTime = Math.min(Math.max(v.currentTime + seconds, 0), v.duration || 0);
    this.wakeControls();
  }

  protected seek(time: number): void {
    this.videoRef().nativeElement.currentTime = time;
    this.currentTime.set(time);
  }

  protected setVolume(value: number): void {
    const v = this.videoRef().nativeElement;
    v.volume = value;
    v.muted = value === 0;
  }

  protected toggleMute(): void {
    const v = this.videoRef().nativeElement;
    v.muted = !v.muted;
    if (!v.muted && v.volume === 0) v.volume = 0.5;
  }

  protected setSpeed(value: number): void {
    this.videoRef().nativeElement.playbackRate = value;
    this.speed.set(value);
    this.openMenu.set(null);
  }

  protected setQuality(label: string): void {
    this.openMenu.set(null);
    if (label === this.selectedQuality()) return;

    const v = this.videoRef().nativeElement;
    this.pending = { time: v.currentTime, resume: !v.paused };
    this.buffering.set(true);
    this.chosenQuality.set(label); // [src] changes -> loadedmetadata fires
  }

  protected toggleFullscreen(): void {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void this.containerRef().nativeElement.requestFullscreen();
    }
  }

  protected toggleMenu(menu: Exclude<MenuName, null>): void {
    this.openMenu.update((m) => (m === menu ? null : menu));
  }

  // ---- Events ---------------------------------------------------------

  protected onLoadedMetadata(): void {
    const v = this.videoRef().nativeElement;
    this.duration.set(v.duration);
    v.playbackRate = this.speed(); // a new src resets the rate

    if (this.pending) {
      v.currentTime = this.pending.time;
      if (this.pending.resume) void v.play();
      this.pending = null;
    }
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (!(event.target as HTMLElement).closest('[data-menu]')) {
      this.openMenu.set(null);
    }
  }

  protected onKeydown(event: KeyboardEvent): void {
    const tag = (event.target as HTMLElement).tagName;
    if (tag === 'INPUT' && event.key !== 'm' && event.key !== 'f') return; // let sliders use arrows

    switch (event.key) {
      case ' ':
      case 'k':
        if (tag === 'BUTTON') return;
        event.preventDefault();
        this.togglePlay();
        break;
      case 'ArrowRight':
      case 'l':
        event.preventDefault();
        this.skip(10);
        break;
      case 'ArrowLeft':
      case 'j':
        event.preventDefault();
        this.skip(-10);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.setVolume(Math.min(this.volume() + 0.1, 1));
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.setVolume(Math.max(this.volume() - 0.1, 0));
        break;
      case 'm':
        this.toggleMute();
        break;
      case 'f':
        this.toggleFullscreen();
        break;
      case 'Escape':
        this.openMenu.set(null);
        break;
    }
    this.wakeControls();
  }

  /** Show controls, then hide them after 2.5s of inactivity while playing. */
  protected wakeControls(): void {
    this.controlsVisible.set(true);
    clearTimeout(this.hideTimer);
    if (this.playing()) {
      this.hideTimer = setTimeout(() => {
        if (this.openMenu() === null) this.controlsVisible.set(false);
      }, 2500);
    }
  }

  // ---- Helpers ----

  protected format(totalSeconds: number): string {
    if (!Number.isFinite(totalSeconds)) return '0:00';
    const s = Math.floor(totalSeconds);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = (s % 60).toString().padStart(2, '0');
    return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${sec}` : `${m}:${sec}`;
  }
}