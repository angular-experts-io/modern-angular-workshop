import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent {
  #productApiService = inject(ProductApiService);

  productId = input.required<string>();

  showChart = signal(false);
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
