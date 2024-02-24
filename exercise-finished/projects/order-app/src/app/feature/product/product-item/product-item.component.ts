import {
  Component,
  computed,
  EventEmitter,
  input,
  Output,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

import { CardComponent } from '../../../ui/card/card.component';
import { ChipComponent } from '../../../ui/chip/chip.component';

import { Product } from '../product.model';

@Component({
  selector: 'my-org-product-item',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatIcon,
    MatIconButton,
    CardComponent,
    ChipComponent,
  ],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss',
})
export class ProductItemComponent {
  product = input.required<Product>();
  disabled = input<boolean>(false);

  @Output() remove = new EventEmitter<Product>();

  averagePrice = computed(() =>
    (
      this.product().pricePerMonth.reduce((a, b) => a + b, 0) /
      this.product().pricePerMonth.length
    ).toFixed(2),
  );
}
