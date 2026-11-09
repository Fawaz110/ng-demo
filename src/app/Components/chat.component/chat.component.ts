import { NgClass } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, signal, ViewChild } from '@angular/core';

/**
 * expected senarios:
 *    1. user enter the chat (no new messages)
 *        => scroll to bottom + (load recent messages "say 20 message")
 *    2. user in the chat reading messages 
 *        => check if he is about to reach bottom 
 *            == if true => (scroll to new messages)
 *            == else => (show new message toast)
 *    3. there are already new message then user enter to see it 
 *        => measure the height of (new messages) container
 *            == if greater than main messages container (scrollable one) => make new messages notch "top-10 for example"
 *            == else => (scroll to bottom "default behavior")
 *    4. user scrolling to top 
 *        => when reach the first message from the top (load more later messages "say 20 messages")         
 */
@Component({
  imports: [
    NgClass
  ],
  selector: 'app-chat',
  styleUrl: './chat.component.css',
  templateUrl: './chat.component.html',
})
export class ChatComponent implements /* OnInit, */ AfterViewInit {
  // sent & failed used to 'mine' messages | delivered & seen
  hasNewMessages = signal(false);
  messageLoading = signal(true);
  @ViewChild("messagesRef") messagesRef!: ElementRef<HTMLDivElement>
  @ViewChild("newMessageToastRef") newMessageToastRef!: ElementRef<HTMLDivElement>
  lastMessages: { id: string, content: string, dateTime: Date, status: 'pending' | 'sent' | 'failed' | 'delivered' | 'seen', isMine: boolean }[] = [
    { id: 'msg-1', isMine: true, status: 'seen', dateTime: new Date(), content: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Amet nihil quis magnam et architecto maxime neque tempora debitis quibusdam doloremque.' },
    { id: 'msg-2', isMine: true, status: 'seen', dateTime: new Date(), content: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Amet nihil quis magnam et architecto maxime neque tempora debitis quibusdam doloremque.' },
    { id: 'msg-2', isMine: false, status: 'failed', dateTime: new Date(), content: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Amet nihil quis magnam et architecto maxime neque tempora debitis quibusdam doloremque.' },
    { id: 'msg-3', isMine: false, status: 'seen', dateTime: new Date(), content: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Amet nihil quis magnam et architecto maxime neque tempora debitis quibusdam doloremque.' },
    { id: 'msg-4', isMine: true, status: 'sent', dateTime: new Date(), content: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Amet nihil quis magnam et architecto maxime neque tempora debitis quibusdam doloremque.' },
    { id: 'msg-5', isMine: false, status: 'pending', dateTime: new Date(), content: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Amet nihil quis magnam et architecto maxime neque tempora debitis quibusdam doloremque.' },
    { id: 'msg-6', isMine: true, status: 'delivered', dateTime: new Date(), content: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Amet nihil quis magnam et architecto maxime neque tempora debitis quibusdam doloremque.' },
    { id: 'msg-7', isMine: false, status: 'failed', dateTime: new Date(), content: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Amet nihil quis magnam et architecto maxime neque tempora debitis quibusdam doloremque.' },
    { id: 'msg-8', isMine: true, status: 'failed', dateTime: new Date(), content: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Amet nihil quis magnam et architecto maxime neque tempora debitis quibusdam doloremque.' },
    { id: 'msg-9', isMine: false, status: 'seen', dateTime: new Date(), content: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Amet nihil quis magnam et architecto maxime neque tempora debitis quibusdam doloremque.' },
  ]

  newMessages: { id: string, content: string, dateTime: Date, status: 'pending' | 'sent' | 'failed' | 'delivered' | 'seen', isMine: boolean }[] = [
    { id: 'msg-10', isMine: false, status: 'delivered', dateTime: new Date(), content: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Amet nihil quis magnam et architecto maxime neque tempora debitis quibusdam doloremque.' },
    { id: 'msg-11', isMine: false, status: 'delivered', dateTime: new Date(), content: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Amet nihil quis magnam et architecto maxime neque tempora debitis quibusdam doloremque.' },
    { id: 'msg-12', isMine: false, status: 'delivered', dateTime: new Date(), content: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Amet nihil quis magnam et architecto maxime neque tempora debitis quibusdam doloremque.' },
  ]

  constructor() { }

  ngAfterViewInit(): void {
    const el = this.messagesRef.nativeElement as HTMLDivElement;
    el.scrollTo({ behavior: 'instant', top: el.scrollHeight });
  }

  private scrollToBottom(behavior: ScrollBehavior = 'smooth'): void {
    requestAnimationFrame(() => {
      const el = this.messagesRef?.nativeElement;

      el.scrollTo({
        top: el.scrollHeight,
        behavior,
      });
    });
  }

  scrollToLastReadMessage() {
    requestAnimationFrame(() => {
      const el = this.newMessageToastRef.nativeElement as HTMLDivElement;
      el.scrollIntoView({behavior: 'instant', block: 'center'});
    })
  }
}
