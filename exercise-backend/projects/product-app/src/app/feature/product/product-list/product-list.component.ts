import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatHint, MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatMiniFabButton } from '@angular/material/button';

import { Product } from '../product.model';
import { ProductItemComponent } from '../product-item/product-item.component';

@Component({
  selector: 'my-org-product-list',
  imports: [
    FormsModule,
    MatIcon,
    MatHint,
    MatInput,
    MatLabel,
    MatFormField,
    MatMiniFabButton,
    ProductItemComponent,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent {
  // TODO 16: inject the newly created "ProductApiService" service

  showFilter = signal(false);
  query = signal('');

  // TODO 4: let's remove the loading and products
  loading = signal(true);
  products = signal<Product[]>([]);

  // TODO 3: let's define new "productResource" property and initialize it with
  // Angular "httpResource" function, use Angular docs https://angular.dev/guide/http/http-resource
  // the httpResource() function accepts an arrow function which returns an
  // url which will be used to fetch data, `http://localhost:4300/api/products`
  // make sure to also add generic type "httpResource<Product[]>" to type the payload from the server

  // TODO 9: Server side filtering
  // let's adjust the URL in the "httpResource" function to include value of the
  // "query" signal as a query param, the backend expects it in the "q=" format
  // how can we add value of the "query" signal to URL using JavaScript template literals?
  // then try to search for products in the running app

  // TODO 11: when reproducing error, typing into query input led to firing of many
  // requests to the server, let's optimize this be debouncing the "query" signal
  // let's introduce new "debouncedQuery" signal and use combination
  // of "toObservable", RxJs "debounceTime" operator (300ms)
  // and "toSignal" to create it based on the "query" signal
  // we can also set initial value of the "debouncedQuery" signal to empty string
  // then, we can use "debouncedQuery" signal in the URL definition of the "httpResource" function instead of "query"
  // try it out in the running app, when you type into the query input, you should see only one request being fired
  // after you stop typing for 300 ms

  // TODO 12: improving UX
  // with our current solution, when we type into the query input, we lose the current products
  // and always show skeleton loaders. It would be better to show skeleton loader only initially
  // and show smaller spinner for every subsequent search
  // the "productResource" loses current items whenever the query changes so we have to add a new
  // property which will preserve them and help us distinguish initial and subsequent loading states
  // let's create a new "products" property and assign it to "linkedSignal" with generic type
  // <Product[], Product[]>, the linkedSignal accepts object with two properties,
  // "source" and "computation" (see https://angular.dev/guide/signals/linked-signal#accounting-for-previous-state)
  // the "source" will contain arrow function which returns "productResource.value() ?? []"
  // the "computation" will contain arrow which has 2 arguments "current" and "previous"
  // then inside of the computation method body, if resource isLoading() return "previous?.value ?? []"
  // otherwise return "current"
  // after that, replace all "productResource.value()" in the template with "products()"

  removeProduct(productId: string) {
    // TODO 15: removing of product items
    // let's create a new "product-api" service in the "product/" feature folder
    // using Angular Schematics (IDE integration)
    // make sure to add autoProvided: false to the generated @Service() decorator
    // and provide the service in the lazy feature "providers: []" array instead
    // (hint: we're using route-based lazy features)
    // then private "httpClient" property (use new JavaScript private syntax with #)
    // which will inject the "HttpClient" service using the modern "inject()" based approach
    // then create a "remove" method which is going to use "httpClient.delete" method to
    // remove data from the server, the API url is `http://localhost:4300/api/products/${productId}`
    //
    // TODO 17: use the new "remove" method to remove the product item from the list
    // to execute RxJs Observable based service, we have to ".subscribe()" to the Observable
    // returned by the service "remove" method
    // the "subscribe()" accepts an arrow function, inside it we will call the
    // "productResource.reload()" method to reload the product list after the removal
    //
    // TODO 18: UX and UI robustness
    // we're successfully removing items but user could in theory click on the remove item
    // more than once triggering multiple requests to remove the same item which would of course fail
    // let's introduce new local component state property "loading" initialized as a "linkedSignal" which
    // accepts arrow function which returns a current value of "productResource.isLoading()"
    // then in the "removeProduct" component method method, set "loading" value to true
    // BEFORE we perform the removal request
  }
}
