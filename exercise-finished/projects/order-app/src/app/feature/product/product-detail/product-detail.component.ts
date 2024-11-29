import { RouterLink } from '@angular/router';
import { Component, computed, inject, input, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';

import { CardComponent } from '../../../ui/card/card.component';
import { ChipComponent } from '../../../ui/chip/chip.component';
import { ChartLineComponent } from '../../../pattern/chart-line/chart-line.component';

import { ProductItemSkeletonComponent } from '../product-item-skeleton/product-item-skeleton.component';
import { ProductService } from '../product.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, switchMap, tap } from 'rxjs';
import { CardStatusComponent } from '../../../ui/card-status/card-status.component';

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
  productService = inject(ProductService);

  showPriceChart = signal<boolean>(false);
  productId = input.required<string>();
  loading = signal(false);
  error = signal<string | undefined>(undefined);
  product = toSignal(
    toObservable(this.productId).pipe(
      tap(() => {
        this.loading.set(true);
        this.error.set(undefined);
      }),
      switchMap((id) =>
        this.productService.findOne(id).pipe(
          catchError((error) => {
            this.error.set(error.message);
            return [undefined];
          }),
        ),
      ),
      tap(() => this.loading.set(false)),
    ),
  );
  averagePrice = computed(() => {
    const product = this.product();
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
