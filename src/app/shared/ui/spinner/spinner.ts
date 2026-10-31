import { Component, input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  template: `
    <span
      class="spinner"
      role="status"
      aria-label="Cargando"
      [style.width.px]="size()"
      [style.height.px]="size()"
      [style.border-width.px]="thickness()"
    ></span>
  `,
  styles: `
    :host {
      display: inline-flex;
      line-height: 0;
    }

    .spinner {
      display: inline-block;
      border-style: solid;
      border-color: currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `,
})
export class Spinner {
  readonly size = input(16);
  readonly thickness = input(2);
}
