import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VideoPlayerComponent } from './Components/video-player.component/video-player.component';

@Component({
  imports: [RouterOutlet, VideoPlayerComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('demo');
}
