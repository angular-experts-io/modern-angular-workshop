import { Component, inject, NgZone } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

@Component({
  selector: 'my-org-root',
  imports: [MainLayoutComponent, MatIcon],
  template: `
    <my-org-main-layout />
    {{ bumpAndGetCdCount() }}
    <span
      tabindex="0"
      class="cd"
      (click)="cdCount = 0"
      (keyup.escape)="cdCount = 0"
    >
      <mat-icon>refresh</mat-icon>{{ cdCount }}</span
    >
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
  private ngZone = inject(NgZone);
  cdCount = 0;

  bumpAndGetCdCount() {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.cdCount++;
      });
    });
  }
}
