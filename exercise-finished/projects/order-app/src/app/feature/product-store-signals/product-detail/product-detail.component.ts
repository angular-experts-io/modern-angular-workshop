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

import { ProductStore } from '../product.store';
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
  #destroyRef = inject(DestroyRef);

  store = inject(ProductStore);

  // from route params :productId
  productId = input.required<string>();
  showPriceChart = signal(false);

  #effectSelectProductById = effect(() => {
    this.store.selectProduct(this.productId());
  });

  #unselectProductIdOnDestroy = this.#destroyRef.onDestroy(() =>
    this.store.selectProduct(undefined),
  );
}
