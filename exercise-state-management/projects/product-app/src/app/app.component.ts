import { Component } from '@angular/core';

import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { CdCounterComponent } from './pattern/cd-counter/cd-counter.component';

@Component({
  selector: 'my-org-root',
  imports: [MainLayoutComponent, CdCounterComponent],
  template: `
    <my-org-main-layout />
    <my-org-cd-counter />
  `,
})
export class AppComponent {}
