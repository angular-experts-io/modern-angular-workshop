import { Component, computed, inject, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

import { CardComponent } from '../../../ui/card/card.component';
import { ChipComponent } from '../../../ui/chip/chip.component';

import { Product } from '../product.model';
import { ProductService } from '../product.service';

@Component({
  selector: 'my-org-product-item',
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
  #productService = inject(ProductService);

  product = input.required<Product>();
  disabled = input<boolean>(false);

  remove = output<Product>();

  averagePrice = computed(() =>
    this.#productService.calculateAveragePrice(this.product()),
  );
}
