import { RouterLink } from '@angular/router';
import { Component, effect, inject, input, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';

import { CardComponent } from '../../../ui/card/card.component';
import { ChipComponent } from '../../../ui/chip/chip.component';
import { CardErrorComponent } from '../../../ui/card-error/card-error.component';
import { ChartLineComponent } from '../../../pattern/chart-line/chart-line.component';

import { ProductStore } from '../product.store';
import { ProductItemSkeletonComponent } from '../product-item-skeleton/product-item-skeleton.component';

@Component({
  selector: 'my-org-product-detail',
  standalone: true,
  imports: [
    RouterLink,
    MatIcon,
    MatIconButton,
    CardComponent,
    ProductItemSkeletonComponent,
    ChipComponent,
    ChartLineComponent,
    MatButton,
    CardErrorComponent,
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent {
  store = inject(ProductStore);

  // from route params :productId
  productId = input.required<string>();
  showPriceChart = signal<boolean>(false);

  constructor() {
    effect(
      () => {
        this.store.selectProduct(this.productId());
      },
      { allowSignalWrites: true },
    );
  }
}
