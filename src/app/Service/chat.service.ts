import { HttpClient } from '@angular/common/http';
import { inject, Service, signal, WritableSignal } from '@angular/core';

let id = 1;
let getId = (): number => id++;

const message = {
    id: getId(),
    profile: './pic-1.jpeg',
    name: 'Mustafa Mohamed',
    lastMessage: 'Hello, how are you?',
    lastMessageTime: '10:30 AM'
}

@Service()
export class ChatService {
    _HttpClient = inject(HttpClient);
    activeChat: WritableSignal<any> = signal(null);
    recentMessages: WritableSignal<any[]> = signal([message, message, message, message, message]);

    constructor() {
        console.log(this.recentMessages())
    }
}
