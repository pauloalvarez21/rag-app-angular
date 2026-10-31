import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { ChatStore } from './chat.store';

describe('ChatStore', () => {
  let store: ChatStore;
  let askQuestion: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    askQuestion = vi.fn();

    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useValue: { askQuestion } }],
    });

    store = TestBed.inject(ChatStore);
  });

  it('starts with a welcome message', () => {
    expect(store.messages().length).toBe(1);
    expect(store.messages()[0].role).toBe('assistant');
  });

  it('adds the user question and the assistant answer', async () => {
    askQuestion.mockReturnValue(of({ answer: 'Respuesta', sources: ['doc.pdf'] }));

    await store.ask('  ¿Qué dice el documento?  ');

    const messages = store.messages();
    expect(messages.length).toBe(3);
    expect(messages[1].role).toBe('user');
    expect(messages[1].content).toBe('¿Qué dice el documento?');
    expect(messages[2].role).toBe('assistant');
    expect(messages[2].content).toBe('Respuesta');
    expect(messages[2].sources).toEqual(['doc.pdf']);
  });

  it('reports errors as an assistant message', async () => {
    askQuestion.mockReturnValue(throwError(() => new Error('Fallo de red')));

    await store.ask('Hola');

    const last = store.messages().at(-1);
    expect(last?.error).toBe(true);
    expect(last?.content).toBe('Fallo de red');
  });

  it('retries the last failed question without duplicating it', async () => {
    askQuestion
      .mockReturnValueOnce(throwError(() => new Error('Fallo de red')))
      .mockReturnValueOnce(of({ answer: 'Respuesta recuperada', sources: [] }));

    await store.ask('Hola');
    expect(store.messages().at(-1)?.error).toBe(true);

    await store.retry();

    const messages = store.messages();
    expect(messages.filter((message) => message.role === 'user').length).toBe(1);
    expect(messages.length).toBe(3);
    expect(messages.at(-1)?.content).toBe('Respuesta recuperada');
    expect(messages.at(-1)?.error).toBeFalsy();
    expect(askQuestion).toHaveBeenCalledTimes(2);
  });

  it('ignores empty questions', async () => {
    await store.ask('   ');

    expect(askQuestion).not.toHaveBeenCalled();
    expect(store.messages().length).toBe(1);
  });

  it('clears the conversation', async () => {
    askQuestion.mockReturnValue(of({ answer: 'Ok', sources: [] }));

    await store.ask('Hola');
    store.clear();

    expect(store.messages().length).toBe(1);
    expect(store.messages()[0].role).toBe('assistant');
  });
});
