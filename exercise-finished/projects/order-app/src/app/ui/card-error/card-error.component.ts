import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'my-org-card-error',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './card-error.component.html',
  styleUrl: './card-error.component.scss',
})
export class CardErrorComponent {
  title = input<string | undefined>(undefined);
  error = input<string | undefined>(undefined);
}
