import { Component, ElementRef, computed, input, output, signal, viewChild } from '@angular/core';
import { Icon } from '../../../../shared/ui/icon/icon';

@Component({
  selector: 'app-chat-composer',
  imports: [Icon],
  templateUrl: './chat-composer.html',
  styleUrl: './chat-composer.css',
})
export class ChatComposer {
  readonly disabled = input(false);
  readonly maxLength = input(2000);

  readonly send = output<string>();

  protected readonly draft = signal('');
  protected readonly canSend = computed(() => this.draft().trim().length > 0 && !this.disabled());

  private readonly textarea = viewChild<ElementRef<HTMLTextAreaElement>>('textarea');

  protected onSubmit(event: Event): void {
    event.preventDefault();
    this.submit();
  }

  protected onInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.draft.set(textarea.value);
    this.resize(textarea);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      this.submit();
    }
  }

  private submit(): void {
    const value = this.draft().trim();

    if (!value || this.disabled()) {
      return;
    }

    this.send.emit(value);
    this.draft.set('');

    const textarea = this.textarea()?.nativeElement;

    if (textarea) {
      textarea.value = '';
      textarea.style.height = 'auto';
      textarea.focus();
    }
  }

  private resize(textarea: HTMLTextAreaElement): void {
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }
}
