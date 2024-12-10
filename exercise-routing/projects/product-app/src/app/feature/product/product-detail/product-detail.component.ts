import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductApiService } from '../product-api.service';
import { ProductItemSkeletonComponent } from '../product-item-skeleton/product-item-skeleton.component';
import { CardComponent } from '../../../ui/card/card.component';
import { ChipComponent } from '../../../ui/chip/chip.component';

@Component({
  selector: 'my-org-product-detail',
  imports: [
    MatIconButton,
    MatIcon,
    RouterLink,
    ProductItemSkeletonComponent,
    CardComponent,
    ChipComponent,
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent {
  #productService = inject(ProductApiService);
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

  product = rxResource({
    request: () => this.productId(),
    loader: ({ request }) => this.#productService.findById(request),
  });

  averagePrice = computed(() => {
    const product = this.product.value();
    if (!product) {
      return '0.00';
    }
    return (
      product.pricePerMonth.reduce((sum, price) => sum + price, 0) /
      product.pricePerMonth.length
    ).toFixed(2);
  });

  // the backend API supports "products/:id" endpoint so let's add method in the service
  // the product will be derived from the productId signal and will use RxJs interop
  // the loading can show existing  "product-item-skeleton" component
  // the product can be displayed by copying parts of the template form "product-item" component
  // you can reimplement the averagePrice computed signal as well (isolation)
  //
  // once done, comment out the current solution
  // and try to use the "rxResource" API and compare the implementations
}
