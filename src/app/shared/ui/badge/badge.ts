import { Component, input } from '@angular/core';

export type BadgeVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

@Component({
  selector: 'app-badge',
  template: `<span class="badge" [class]="'badge badge--' + variant()"><ng-content /></span>`,
  styles: `
    :host {
      display: inline-flex;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      height: 24px;
      padding: 0 0.55rem;
      border-radius: var(--radius-pill);
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.01em;
      white-space: nowrap;
    }

    .badge--neutral {
      background: var(--color-surface-muted);
      color: var(--color-ink-soft);
      border: 1px solid var(--color-border);
    }

    .badge--primary {
      background: var(--color-primary-soft);
      color: var(--color-primary);
    }

    .badge--success {
      background: var(--color-success-soft);
      color: var(--color-success);
    }

    .badge--warning {
      background: var(--color-warning-soft);
      color: var(--color-warning);
    }

    .badge--danger {
      background: var(--color-danger-soft);
      color: var(--color-danger);
    }

    .badge--info {
      background: var(--color-info-soft);
      color: var(--color-info);
    }
  `,
})
export class Badge {
  readonly variant = input<BadgeVariant>('neutral');
}
