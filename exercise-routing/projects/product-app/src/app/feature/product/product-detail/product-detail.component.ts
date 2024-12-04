import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ProductApiService } from '../product-api.service';
import { switchMap, tap } from 'rxjs';
import { ProductItemSkeletonComponent } from '../product-item-skeleton/product-item-skeleton.component';
import { ChipComponent } from '../../../ui/chip/chip.component';
import { CardComponent } from '../../../ui/card/card.component';

@Component({
  selector: 'my-org-product-detail',
  imports: [
    MatIconButton,
    MatIcon,
    RouterLink,
    ProductItemSkeletonComponent,
    ChipComponent,
    CardComponent,
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent {
  #productApiService = inject(ProductApiService);
  // TODO 11: let's add a productId and initialize it to input (signal) of type string
  // make it required as well and print it's value in the bottom of the template
  // check out the running app and see if the productId is printed correctly
  // what would happen if we renamed it from productId to id and why?
  productId = input.required<string>();
  //
  // TODO 12: let's implement loading, error and product signals
  // the use-case is to load individual product from the API and display it
  // in the template, try to apply what we learned from the product list to make
  // we're going to use the same component based state management approach
  // loading = signal(true);
  // product = toSignal(
  //   toObservable(this.productId).pipe(
  //     tap(() => this.loading.set(true)),
  //     switchMap((productId) => this.#productApiService.findById(productId)),
  //     tap(() => this.loading.set(false)),
  //   ),
  // );

  product = rxResource({
    request: () => this.productId(),
    loader: ({ request }) => this.#productApiService.findById(request),
  });

  averagePrice = computed(() => {
    const product = this.product.value();
    return product
      ? (
          product.pricePerMonth.reduce((a, b) => a + b, 0) /
          product.pricePerMonth.length
        ).toFixed(2)
      : '';
  });
  //
  // the backend API supports "products/:id" endpoint
  // the product will be derived from the productId signal and will use RxJs interop
  // the loading can show existing  "product-item-skeleton" component
  // the product can be displayed by copying parts of the template form "product-item" component
  // you can reimplement the averagePrice computed signal as well (isolation)
  //
  // once done, comment out the current solution
  // and try to use the "rxResource" API and compare the implementations
}
