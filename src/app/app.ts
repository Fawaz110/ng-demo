import { Component, signal } from '@angular/core';
import { VideoSource, VideoPlayerComponent } from './Components/video-player-cloude.component/video-player.component';

@Component({
  imports: [VideoPlayerComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('demo');
  sources: VideoSource[] = [
    { label: '1080px', src: './video.mp4' },
    { label: '720px', src: './video.mp4' },
    { label: '480px', src: './video.mp4' },
    { label: '360px', src: './video.mp4' },
  ];
}
