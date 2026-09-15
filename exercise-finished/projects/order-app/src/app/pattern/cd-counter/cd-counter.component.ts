import { afterEveryRender, Component, ElementRef, viewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'my-org-cd-counter',
  imports: [MatIcon],
  template: `
    <span
      tabindex="0"
      title="Application renders (afterEveryRender)"
      (click)="setCdCount(0)"
      (keyup.escape)="setCdCount(0)"
    >
      <mat-icon>refresh</mat-icon>
      <span #cd>0</span>
    </span>
  `,
  styles: `
    :host > span {
      @apply fixed top-4 sm:top-5 left-2 text-black z-50 flex items-center cursor-pointer;
    }
  `,
})
export class CdCounterComponent {
  cdCountTarget = viewChild.required<ElementRef<HTMLSpanElement>>('cd');
  #cdCount = 0;

  constructor() {
    afterEveryRender({
      // A template-bound count signal would trigger another render after each increment.
      write: () => this.setCdCount(this.#cdCount + 1),
    });
  }

  setCdCount(count: number) {
    this.#cdCount = count;
    this.cdCountTarget().nativeElement.textContent = count.toFixed(0);
  }
}
