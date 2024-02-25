import {
  Component,
  computed,
  EventEmitter,
  input,
  Output,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';

export type CardStatus = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'my-org-card-status',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './card-status.component.html',
  styleUrl: './card-status.component.scss',
  host: {
    '[class.is-error]': 'status() === "error"',
    '[class.is-warning]': 'status() === "warning"',
    '[class.is-success]': 'status() === "success"',
    '[class.is-info]': 'status() === "info"',
  },
})
export class CardStatusComponent {
  title = input<string | undefined>(undefined);
  description = input<string | undefined>(undefined);
  status = input<CardStatus>('info');
  icon = computed(() => {
    switch (this.status()) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'info';
    }
  });
  titleOrCapitalizedStatus = computed(() => {
    if (this.title()) {
      return this.title();
    } else {
      const [firstLetter, ...rest] = this.status();
      return `${firstLetter.toUpperCase()}${rest.join('')}`;
    }
  });

  @Output() dismiss = new EventEmitter<void>();
}
