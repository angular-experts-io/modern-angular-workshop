import { RouterLink } from '@angular/router';
import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';

import { CardComponent } from '../../../ui/card/card.component';
import { ChipComponent } from '../../../ui/chip/chip.component';
import { ChartLineComponent } from '../../../pattern/chart-line/chart-line.component';

import { ProductService } from '../product.service';
import { ProductItemSkeletonComponent } from '../product-item-skeleton/product-item-skeleton.component';

@Component({
  selector: 'my-org-product-detail',
  imports: [
    RouterLink,
    MatIcon,
    MatButton,
    MatIconButton,
    ChipComponent,
    CardComponent,
    ChartLineComponent,
    ProductItemSkeletonComponent,
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent {
  private destroyRef = inject(DestroyRef);

  productService = inject(ProductService);

  // from route params :productId
  productId = input.required<string>();
  showPriceChart = signal(false);

  constructor() {
    effect(
      () => {
        this.productService.updateSelectedProductId(this.productId());
      },
      
    );
    this.destroyRef.onDestroy(() =>
      this.productService.updateSelectedProductId(undefined),
    );
  }
}
