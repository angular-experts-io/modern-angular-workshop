import {
  ChangeDetectionStrategy,
  Component,
  computed, EventEmitter,
  input, Output,
} from '@angular/core';

import { Product } from '../product.model';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'my-org-product-item',
  standalone: true,
  imports: [
    MatIconButton,
    MatIcon
  ],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductItemComponent {
  product = input.required<Product>();
  averagePrice = computed(() => {
    return (
      this.product().pricePerMonth.reduce((a, b) => a + b, 0) /
      this.product().pricePerMonth.length
    ).toFixed(2);
  });

  @Output() remove = new EventEmitter<string>();
}
