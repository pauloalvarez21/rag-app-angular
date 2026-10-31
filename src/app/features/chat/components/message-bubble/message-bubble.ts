import { DatePipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { Message } from '../../../../core/models/chat.model';
import { Icon } from '../../../../shared/ui/icon/icon';
import { MarkdownPipe } from '../../../../shared/pipes/markdown.pipe';

@Component({
  selector: 'app-message-bubble',
  imports: [DatePipe, Icon, MarkdownPipe],
  templateUrl: './message-bubble.html',
  styleUrl: './message-bubble.css',
})
export class MessageBubble {
  readonly message = input.required<Message>();

  readonly retry = output<void>();

  protected readonly isUser = computed(() => this.message().role === 'user');
}
