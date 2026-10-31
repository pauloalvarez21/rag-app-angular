import { Component, input } from '@angular/core';
import { Icon, IconName } from '../icon/icon';

@Component({
  selector: 'app-empty-state',
  imports: [Icon],
  template: `
    <div class="empty-state">
      <span class="empty-state__icon">
        <app-icon [name]="icon()" [size]="22" />
      </span>
      <h3>{{ title() }}</h3>
      @if (description()) {
        <p>{{ description() }}</p>
      }
      <div class="empty-state__action">
        <ng-content />
      </div>
    </div>
  `,
  styles: `
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 2.5rem 1.5rem;
    }

    .empty-state__icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 52px;
      height: 52px;
      border-radius: var(--radius-lg);
      background: var(--color-surface-muted);
      color: var(--color-muted);
      margin-bottom: 1rem;
    }

    h3 {
      font-size: 0.975rem;
      font-weight: 650;
      color: var(--color-ink);
    }

    p {
      margin-top: 0.35rem;
      max-width: 42ch;
      font-size: 0.85rem;
      color: var(--color-muted);
      line-height: 1.5;
    }

    .empty-state__action:not(:empty) {
      margin-top: 1.1rem;
    }
  `,
})
export class EmptyState {
  readonly icon = input<IconName>('database');
  readonly title = input.required<string>();
  readonly description = input('');
}
