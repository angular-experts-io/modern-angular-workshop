import { RouterLink } from '@angular/router';
import { Component, computed, inject, input, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { rxResource } from '@angular/core/rxjs-interop';

import { CardComponent } from '../../../ui/card/card.component';
import { ChipComponent } from '../../../ui/chip/chip.component';
import { CardStatusComponent } from '../../../ui/card-status/card-status.component';
import { ChartLineComponent } from '../../../pattern/chart-line/chart-line.component';

import { ProductService } from '../product.service';
import { ProductItemSkeletonComponent } from '../product-item-skeleton/product-item-skeleton.component';

@Component({
  selector: 'my-org-product-detail',
  imports: [
    RouterLink,
    MatIcon,
    MatIconButton,
    CardComponent,
    ProductItemSkeletonComponent,
    ChipComponent,
    ChartLineComponent,
    MatButton,
    CardStatusComponent,
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent {
  #productService = inject(ProductService);

  productId = input.required<string>();
  product = rxResource({
    request: () => this.productId(),
    loader: ({ request }) => this.#productService.findOne(request),
  });

  showPriceChart = signal(false);
  averagePrice = computed(() => {
    const product = this.product.value();
    if (product) {
      return (
        product.pricePerMonth.reduce((a, b) => a + b, 0) /
        product.pricePerMonth.length
      ).toFixed(2);
    } else {
      return '0.00';
    }
  });
}
