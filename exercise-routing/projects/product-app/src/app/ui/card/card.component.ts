import { Component, input } from '@angular/core';

@Component({
  selector: 'my-org-card',
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  host: {
    '[class.is-col]': 'col()',
    '[class.is-center]': 'center()',
    '[class.is-clickable]': 'clickable()',
    '[class.is-active]': 'active()',
  },
})
export class CardComponent {
  col = input(false);
  center = input(false);
  active = input(false);
  clickable = input(false);
}
