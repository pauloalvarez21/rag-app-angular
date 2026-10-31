import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Message } from '../../../core/models/chat.model';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { errorMessage } from '../../../core/utils/error-message';
import { uid } from '../../../core/utils/uid';

@Injectable({ providedIn: 'root' })
export class ChatStore {
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);

  private readonly _messages = signal<Message[]>([welcomeMessage()]);
  private readonly _sending = signal(false);

  readonly messages = this._messages.asReadonly();
  readonly sending = this._sending.asReadonly();
  readonly canClear = computed(() => this._messages().length > 1 && !this._sending());

  async ask(question: string): Promise<void> {
    const trimmed = question.trim();

    if (!trimmed || this._sending()) {
      return;
    }

    this._messages.update((messages) => [
      ...messages,
      { id: uid(), role: 'user', content: trimmed, timestamp: new Date() },
    ]);

    await this.request(trimmed);
  }

  async retry(): Promise<void> {
    if (this._sending()) {
      return;
    }

    const messages = this._messages();
    const last = messages.at(-1);

    if (!last || last.role !== 'assistant' || !last.error) {
      return;
    }

    const lastUser = [...messages].reverse().find((message) => message.role === 'user');

    if (!lastUser) {
      return;
    }

    this._messages.update((current) => current.slice(0, -1));
    await this.request(lastUser.content);
  }

  clear(): void {
    if (this._sending()) {
      return;
    }

    this._messages.set([welcomeMessage()]);
  }

  private async request(question: string): Promise<void> {
    this._sending.set(true);

    try {
      const response = await firstValueFrom(this.api.askQuestion(question));

      this._messages.update((messages) => [
        ...messages,
        {
          id: uid(),
          role: 'assistant',
          content: response.answer,
          sources: response.sources ?? [],
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      const message = errorMessage(error, 'No se pudo obtener una respuesta del asistente.');

      this._messages.update((messages) => [
        ...messages,
        {
          id: uid(),
          role: 'assistant',
          content: message,
          timestamp: new Date(),
          error: true,
        },
      ]);
      this.toast.error(message);
    } finally {
      this._sending.set(false);
    }
  }
}

function welcomeMessage(): Message {
  return {
    id: uid(),
    role: 'assistant',
    content:
      'Hola. Soy tu asistente de conocimiento. Sube un documento y pregúntame lo que necesites sobre su contenido.',
    timestamp: new Date(),
  };
}
