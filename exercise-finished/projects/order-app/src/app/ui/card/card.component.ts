import { Component, input } from '@angular/core';

@Component({
  selector: 'my-org-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  host: {
    '[class.is-center]': 'center()',
    '[class.is-clickable]': 'clickable()',
    '[class.is-active]': 'active()',
  },
})
export class CardComponent {
  center = input(false);
  active = input(false);
  clickable = input(false);
}
