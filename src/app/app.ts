import { Component, inject, signal, WritableSignal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ChatCell } from './Components/chat-cell/chat-cell';
import { ChatService } from './Service/chat.service';
import { ChatFooter } from './Components/chat-footer/chat-footer';
@Component({
  imports: [
    ChatCell,
    ChatFooter
  ],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('chat demo');
  _ChatService = inject(ChatService);
  private _Title = inject(Title);
  
  constructor() {
    this._Title.setTitle(this.title())
  }
}
