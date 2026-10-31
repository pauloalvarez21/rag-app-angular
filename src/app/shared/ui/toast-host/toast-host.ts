import { Component, inject } from '@angular/core';
import { ToastKind, ToastService } from '../../../core/services/toast.service';
import { Icon, IconName } from '../icon/icon';

@Component({
  selector: 'app-toast-host',
  imports: [Icon],
  template: `
    <div class="toast-stack" aria-live="polite" aria-atomic="false">
      @for (toast of toasts(); track toast.id) {
        <div class="toast" [class]="'toast toast--' + toast.kind" role="status">
          <span class="toast__icon">
            <app-icon [name]="iconFor(toast.kind)" [size]="18" />
          </span>
          <p class="toast__message">{{ toast.message }}</p>
          <button
            type="button"
            class="toast__close"
            aria-label="Cerrar notificación"
            (click)="toastService.dismiss(toast.id)"
          >
            <app-icon name="close" [size]="16" />
          </button>
        </div>
      }
    </div>
  `,
  styles: `
    .toast-stack {
      position: fixed;
      right: 1.5rem;
      bottom: 1.5rem;
      z-index: var(--z-toast);
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      width: min(380px, calc(100vw - 2rem));
      pointer-events: none;
    }

    .toast {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.85rem 0.9rem;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-left-width: 3px;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-md);
      pointer-events: auto;
      animation: toast-in var(--transition-base) both;
    }

    .toast--success {
      border-left-color: var(--color-success);
    }

    .toast--error {
      border-left-color: var(--color-danger);
    }

    .toast--info {
      border-left-color: var(--color-info);
    }

    .toast__icon {
      display: inline-flex;
      margin-top: 1px;
    }

    .toast--success .toast__icon {
      color: var(--color-success);
    }

    .toast--error .toast__icon {
      color: var(--color-danger);
    }

    .toast--info .toast__icon {
      color: var(--color-info);
    }

    .toast__message {
      flex: 1;
      font-size: 0.875rem;
      color: var(--color-ink);
      line-height: 1.4;
    }

    .toast__close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      padding: 0;
      border: 0;
      border-radius: var(--radius-sm);
      background: transparent;
      color: var(--color-muted);
      flex-shrink: 0;
    }

    .toast__close:hover {
      background: var(--color-surface-muted);
      color: var(--color-ink);
    }

    @keyframes toast-in {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 560px) {
      .toast-stack {
        right: 1rem;
        left: 1rem;
        bottom: 1rem;
        width: auto;
      }
    }
  `,
})
export class ToastHost {
  protected readonly toastService = inject(ToastService);
  protected readonly toasts = this.toastService.toasts;

  protected iconFor(kind: ToastKind): IconName {
    switch (kind) {
      case 'success':
        return 'check';
      case 'error':
        return 'alert';
      default:
        return 'info';
    }
  }
}
