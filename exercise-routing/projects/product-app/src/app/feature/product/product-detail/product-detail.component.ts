import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'my-org-product-detail',
  standalone: true,
  imports: [],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent {
  // TODO 11: let's add a productId and initialize it to input (signal) of type string
  // make it required as well and print it's value in the bottom of the template
  // check out the running app and see if the productId is printed correctly
  // what would happen if we renamed it from productId to id and why?
  // TODO 12: let's implement loading, error and product signals
  // the use-case is to load individual product from the API and display it
  // in the template, try to apply what we learned from the product list to make
  // it happen using the same component state management approach
  // the backend API supports "products/:id" endpoint
  // the product will be derived from the productId signal and will use RxJs interop
  // the loading can show existing  "product-item-skeleton" component
  // the product can be displayed by copying parts of the template form "product-item" component
  // you can reimplement the averagePrice computed signal as well (isolation)
}
