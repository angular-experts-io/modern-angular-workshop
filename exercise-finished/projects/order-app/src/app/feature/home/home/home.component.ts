import { afterNextRender, afterRender, AfterRenderPhase, ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'my-org-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  constructor() {
    afterRender(() => {
      console.log('HomeComponent after render');
    }, {phase: AfterRenderPhase.Read});

    afterNextRender(() => {
      console.log('HomeComponent after next render');
    });
  }
}
