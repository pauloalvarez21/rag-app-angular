import { Component, ElementRef, effect, inject, viewChild } from '@angular/core';
import { Icon } from '../../../shared/ui/icon/icon';
import { ChatComposer } from '../components/chat-composer/chat-composer';
import { MessageBubble } from '../components/message-bubble/message-bubble';
import { ChatStore } from '../data/chat.store';

@Component({
  selector: 'app-chat-page',
  imports: [ChatComposer, MessageBubble, Icon],
  templateUrl: './chat-page.html',
  styleUrl: './chat-page.css',
})
export class ChatPage {
  protected readonly chat = inject(ChatStore);

  private readonly scrollRef = viewChild<ElementRef<HTMLElement>>('scroll');

  constructor() {
    effect(() => {
      this.chat.messages();
      this.chat.sending();

      const element = this.scrollRef()?.nativeElement;

      if (element) {
        setTimeout(() => {
          element.scrollTop = element.scrollHeight;
        });
      }
    });
  }

  protected async onSend(question: string): Promise<void> {
    await this.chat.ask(question);
  }

  protected clear(): void {
    this.chat.clear();
  }

  protected onRetry(): void {
    void this.chat.retry();
  }
}
