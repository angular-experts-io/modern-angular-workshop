import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  viewChild,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'my-org-cd-counter',
  imports: [MatIcon],
  template: `
    <span tabindex="0" (click)="setCdCount(0)" (keyup.escape)="setCdCount(0)">
      {{ bumpAndGetCdCount() }}
      <mat-icon>refresh</mat-icon>
      <span #cd>0</span>
    </span>
  `,
  styles: `
    :host > span {
      @apply fixed top-4 sm:top-5 left-2 text-black z-50 flex items-center cursor-pointer;
    }
  `,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CdCounterComponent {
  cdCountTarget = viewChild.required<ElementRef<HTMLSpanElement>>('cd');

  bumpAndGetCdCount() {
    const count = parseInt(
      this.cdCountTarget().nativeElement.textContent ?? '0',
      10,
    );
    this.setCdCount(count + 1);
  }

  setCdCount(count: number) {
    this.cdCountTarget().nativeElement.textContent = count.toFixed(0);
  }
}
