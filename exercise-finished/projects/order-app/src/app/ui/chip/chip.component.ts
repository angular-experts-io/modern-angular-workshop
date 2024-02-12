import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'my-org-chip',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss',
  host: {
    '[class.is-primary]': 'color() === "primary"',
    '[class.is-accent]': 'color() === "accent"',
    '[class.is-warn]': 'color() === "warn"',
  }
})
export class ChipComponent {
  icon = input<string | undefined>();
  color = input<string | undefined>();
}
