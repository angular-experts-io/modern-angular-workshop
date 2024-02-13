import { RouterLink } from '@angular/router';
import { Component, computed, inject, input, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';

import { CardComponent } from '../../../ui/card/card.component';
import { ChipComponent } from '../../../ui/chip/chip.component';
import { ChartLineComponent } from '../../../pattern/chart-line/chart-line.component';

import { ProductService } from '../product.service';
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
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent {
  products = inject(ProductService).products;
  productId = input<string | undefined>();

  product = computed(
    () => this.products().products.find((p) => p.id === this.productId())!,
  );

  averagePrice = computed(() =>
    (
      this.product().pricePerMonth.reduce((a, b) => a + b, 0) /
      this.product().pricePerMonth.length
    ).toFixed(2),
  );

  showPriceChart = signal<boolean>(false);

  toggleShowPriceChart() {
    this.showPriceChart.set(!this.showPriceChart());
  }
}
