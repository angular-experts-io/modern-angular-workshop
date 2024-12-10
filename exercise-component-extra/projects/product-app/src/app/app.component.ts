import { MatIcon } from '@angular/material/icon';
import { Component, ElementRef, viewChild } from '@angular/core';

import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

@Component({
  selector: 'my-org-root',
  imports: [MainLayoutComponent, MatIcon],
  template: `
    <my-org-main-layout />

    <span
      tabindex="0"
      class="cd"
      (click)="setCdCount(0)"
      (keyup.escape)="setCdCount(0)"
    >
      {{ bumpAndGetCdCount() }}
      <mat-icon>refresh</mat-icon>
      <span #cd>0</span>
    </span>
  `,
  styles: [
    `
      .cd {
        @apply fixed top-4 sm:top-5 left-2 text-black z-50 flex items-center cursor-pointer;
      }
    `,
  ],
})
export class AppComponent {
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
