import {
  ChangeDetectionStrategy,
  Component,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatHint, MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatButton, MatMiniFabButton } from '@angular/material/button';

import { Product } from '../product.model';
import { ProductItemComponent } from '../product-item/product-item.component';
import { ProductItemSkeletonComponent } from '../product-item-skeleton/product-item-skeleton.component';

@Component({
  selector: 'my-org-product-list',
  standalone: true,
  imports: [
    FormsModule,
    MatIcon,
    MatHint,
    MatInput,
    MatLabel,
    MatButton,
    MatFormField,
    MatMiniFabButton,
    ProductItemComponent,
    ProductItemSkeletonComponent,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent {
  // TODO 5: let's inject newly created service using the inject() function

  showFilter = signal(false);
  query = signal<string>('');

  loading = signal<boolean>(true);
  error = signal<string | undefined>(undefined);

  products = signal<Product[] | undefined>(undefined);
  // TODO 6: Loading products from the API
  // let's redefine the products signal to be a toSignal(...) instead,
  // the toSignal() subscribes to the inner observable, so first we're going to just call
  // the find() method on the "productApiService" which returns an RxJs Observable
  // let's chain it also with RxJs pipe() method and use the tap() operator
  // to set the "loading" signal to false (all this happens inside the toSignal() function)
  // last step is to provide second argument to the toSignal() function, which is the
  // options object with the initial value set to an empty array
  // In the running app, we should see skeleton items for a brief moment before the real data arrives

  // TODO 7: Server side filtering
  // in previous exercise we've implemented the client side filtering
  // often, the data set is so large that we have to implement server side filtering instead
  // we will want to reload the products from the server whenever the query signal changes
  // as we go through the following steps, our code will be "broken" for a while, that's expected

  // TODO 8: let's start by commenting out previous "products" definition
  // and create new "products" definition using the toSignal() function here
  // then, streamify "query" signal using the toObservable() function
  // and put it as a first statement in the previously used toSignal() function
  // and attach a .pipe() after it
  // inside of the pipe we will want to use "debounceTime" operator (with a delay of 300 ms)
  // to only react when user stops typing

  // TODO 9: next we're going to add a tap() operator to set the "loading" signal to true
  // and the "error" signal to undefined

  // TODO 10: then we're going to use switchMap() operator which receives
  // the streamified value of "query" signal
  // and returns the productApiService.find() method with the "query" as its argument
  // in the ProductApiService, let's adjust the find() method to accept the "query" as a string
  // and use it to set "query" value as a "q" query param in the request (figure out how)
  // let's add a tap after the switchMap which sets "loading" signal to false,
  // the running app should now support server side filtering, try it out!

  // TODO 11: let's add a new catchError() operator to handle the error
  // the catchError() operator has to be used in the nested pipe() which
  // we are going to add after the productApiService.find() call
  // (handling error on top level would crash the stream after the first error!)
  // in the operator, we want to set "error" signal to value of error.message
  // and return [[]] (which is the same as of([]), learn more about "ObservableInput" interface)
  // let's try it out in the browser,
  // after successful initial load...
  // lets open chrome dev tools, network tab and select "Offline" in the throttling dropdown
  // adjusting query will trigger a new request which should fail and display an error message

  removeProduct(productId: string) {
    // TODO 12: removing of the product
    // in the productApiService, let's implement the remove() method
    // to use the HttpClient delete() method to remove the product by its id
    // the id will be used as the path param of the API url `/products/${productId}`
    // once ready we can use the remove() method here in the ProductListComponent
    // the method returns an Observable, so we can subscribe to it
    // what is the problem with this approach?
    // (hint: you can always refresh the page to see the changes)
    // (hint: you can revert deleted products by git rollback of changes in the db.json file)

    // TODO 13: refreshing the products list
    // the products is NOT a writable signal, so it doesn't have set or update methods
    // this means we can't just update the list of products after the removal
    // in the subscribe() method above using something like an update() method...

    // let's solve this by creating a private RxJs Subject of type string called "refreshTrigger"
    // in the subscribe() method, we can call the next() method on the "refreshTrigger"
    // and pass in the current value of the "query" signal
    // once the setup is ready, we can add the "refreshTrigger" using the mergeWith() operator
    // as the first statement of the pipe() (before debounceTime())
    // (optional): add error handling to the subscribe() method

    // handling state in components is suboptimal because of the following reasons
    // - a lot of logic is in components and components are hardest to test
    // - the logic itself is complex and involves many concepts to achieve the goal
    // - state in component (eg with sub routes) because it can't be passed to children components
    //   (there is no input / output between routed components)

    // TODO 14: UX concerns
    // whenever we're setting "loading" flag, were showing skeleton items, even if we already loaded them previously
    // let's rename our current "loading" flag to "loadingSkeleton" (IDE refactoring should also update the template)
    // let's add a new add a new boolean signal based flag called "loading" (same as before) and initialize it to false

    // in the template, we're going to add <mat-spinner [diameter]="40" /> component
    // after the <h2>Product list</h2> and use the new "loading" signal to show/hide it with @if
    // now we're going to update the removeProduct() method to set the "loading" signal to true initially
    // and set it back to false after the refreshTrigger.next() call

    // great, now we're showing a small spinner during the removal of the product,
    // but after we're still displaying the skeleton items for a brief moment when we refresh the list
    // let's solve that by adding an if condition in the first tap operator of the products signal
    // which will set either "loading" or "loadingSkeleton" signal to true based on if we already have some products
    // last step is to make sure that the last tap operator sets both "loading" and "loadingSkeleton" to false

    // TODO 15: use the "loading" signal in the product item to disable the remove button
    // we're going to need additional input in the product item component
    // which accepts the state of "loading" signal

    // great, now we're showing targeted feedback to the user and the UX is improved

  }
}
