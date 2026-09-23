import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { catchError, switchMap, tap } from 'rxjs';

import { CardComponent } from '../../../ui/card/card.component';
import { ChipComponent } from '../../../ui/chip/chip.component';

import { Product } from '../product.model';
import { ProductApiService } from '../product-api.service';
import { ProductItemSkeletonComponent } from '../product-item-skeleton/product-item-skeleton.component';
import { ChartLineComponent } from '../../../pattern/chart-line/chart-line.component';

@Component({
  selector: 'my-org-product-detail',
  imports: [
    RouterLink,
    MatIcon,
    MatIconButton,
    CardComponent,
    ChipComponent,
    ProductItemSkeletonComponent,
    ChartLineComponent,
    MatButton,
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent {
  #productApiService = inject(ProductApiService);

  // from route param
  productId = input.required<string>();
  showChart = signal(false);

  // TODO 23: (Optional): move selected-product data into ProductService
  // expose selectedProductId through a readonly signal and an explicit update method
  // expose selectedProduct, its loading state and its error state
  // use the shared products when the selected id is present
  // if the id is absent (for example after filtering or opening a detail URL directly), load it by id
  // update the selected id from the route input and adapt the detail's data and template bindings
  // keep showChart and the averagePrice computed in the component
  loading = signal(true);
  error = signal<string | undefined>(undefined);
  product = toSignal<Product | undefined>(
    toObservable(this.productId).pipe(
      tap(() => {
        this.loading.set(true);
        this.error.set(undefined);
      }),
      switchMap((id) =>
        this.#productApiService.findOne(id).pipe(
          catchError((e) => {
            this.error.set(e.message ?? e.toString());
            return [];
          }),
        ),
      ),
      tap(() => this.loading.set(false)),
    ),
  );

  averagePrice = computed(() => {
    const product = this.product();
    if (!product) {
      return 0;
    }
    return (
      product.pricePerMonth.reduce((total, next) => (total += next), 0) /
      product.pricePerMonth.length
    ).toFixed(2);
  });
}
