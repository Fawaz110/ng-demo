import { Component, inject, Input } from '@angular/core';
import { ChatService } from '../../Service/chat.service';
import { formatMessageDate } from '../../Core/Helpers/helpers';

@Component({
  imports: [],
  selector: 'app-chat-cell',
  styleUrl: './chat-cell.css',
  templateUrl: './chat-cell.html',
})
export class ChatCell {
  _ChatService = inject(ChatService)
  /**
      id, userId, profile, name, lastMessage, lastMessageTime, lastMessageStatus, unreadCount, isPinned
   */
  @Input() message = {
    id: 1,
    userId: 1,
    profile: './pic-1.jpeg',
    name: 'Mustafa Mohamed',
    lastMessage: {
      status: 'sent',
      content: 'Hello, how are you?',
      dateTime: new Date(),
    },
    isPinned: true,
    unReadCount: 20
  }
  
  openChat() {
    this._ChatService.activeChat.set(this.message)
    console.log(this.message);
  }

  getDateTime = (): string => formatMessageDate(this.message.lastMessage.dateTime)
}
