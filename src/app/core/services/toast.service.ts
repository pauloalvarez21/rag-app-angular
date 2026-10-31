import { Injectable, signal } from '@angular/core';
import { uid } from '../utils/uid';

export type ToastKind = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  kind: ToastKind;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _toasts = signal<Toast[]>([]);

  readonly toasts = this._toasts.asReadonly();

  success(message: string, timeout = 4000): void {
    this.show(message, 'success', timeout);
  }

  error(message: string, timeout = 6000): void {
    this.show(message, 'error', timeout);
  }

  info(message: string, timeout = 4000): void {
    this.show(message, 'info', timeout);
  }

  dismiss(id: string): void {
    this._toasts.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }

  private show(message: string, kind: ToastKind, timeout: number): void {
    const toast: Toast = { id: uid(), kind, message };
    this._toasts.update((toasts) => [...toasts, toast]);

    if (timeout > 0) {
      setTimeout(() => this.dismiss(toast.id), timeout);
    }
  }
}
