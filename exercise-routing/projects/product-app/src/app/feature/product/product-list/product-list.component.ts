import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import { MatHint, MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatButton, MatMiniFabButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {
  catchError,
  debounceTime,
  mergeWith,
  Subject,
  switchMap,
  tap,
} from 'rxjs';

import { ProductItemComponent } from '../product-item/product-item.component';
import { ProductItemSkeletonComponent } from '../product-item-skeleton/product-item-skeleton.component';
import { ProductApiService } from '../product-api.service';

@Component({
  selector: 'my-org-product-list',
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
    MatProgressSpinner,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent {
  #productApiService = inject(ProductApiService);
  #refreshTrigger = new Subject<string>();

  showFilter = signal(false);
  query = signal('');

  loading = signal(false);
  loadingSkeleton = signal(true);
  error = signal<string | undefined>(undefined);

  products = toSignal(
    toObservable(this.query).pipe(
      mergeWith(this.#refreshTrigger),
      debounceTime(300),
      tap(() => {
        if (this.products()?.length) {
          this.loading.set(true);
        } else {
          this.loadingSkeleton.set(true);
        }
        this.error.set(undefined);
      }),
      switchMap((query) =>
        this.#productApiService.find(query).pipe(
          catchError((error) => {
            this.error.set(error?.message?.toString());
            return [[]];
          }),
        ),
      ),
      tap(() => {
        this.loading.set(false);
        this.loadingSkeleton.set(false);
      }),
    ),
    { initialValue: [] },
  );

  // TODO 13: reflecting UI state to URL query params
  // let's synchronize state of query signal to the URL to provide even better deep linking capabilities
  // first, let's inject the Router injectable
  //
  // let's define a constructor which will allow us to use Angular Signals "effect"
  // in the effect we will use router.navigate() method and navigate to the same route []
  // and then, in the second options object argument, we're going to specify queryParams
  // with query assigned to this.query() signal value, make sure to assign undefined if the query is empty
  // next we're going to specify queryParamsHandling to "merge" to not lose other query params
  // let's try it in the running app, the URL should now reflect the query signal value
  //
  // TODO 14: reflecting URL query param state to UI state
  // now we need to define a new signal input "queryFromUrl"
  // which will receive value from URL query params because we are using "withComponentInputBinding"
  // the defined signal input has different name compared to what we have in the URL (?query=...)
  // to solve this, we're going to initialize it with an empty string '' and provide
  // an option object as the second argument, in the options object we're going to provide
  // "alias" property with the "query" as the value, that way we're going to automatically
  // receive correct value from the URL query params and can use it in our logic

  // after we're going to define a NEW effect which will be triggered when "queryFromUrl" signal changes
  // in the effect we're going to check if the "queryFromUrl" has a value
  // if it does, we're going to set the "query" signal value to the value from the "queryFromUrl" input
  // lastly, we're going to set the "showFilter" signal value to true if the query has a value
  // before Angular 19, the effect is setting a signal value, so we will need to provide additional configuration, what was the error and the flag?
  // try it in the running app, it shouldn't work, try to add log statements, how many times the effect is triggered and why?
  // accessing signal in the effect schedules its run when the signal value changes, which signal are we accessing?
  // try to use "untracked" Angular signals API to solve this issue
  //
  // summary: it's much better and cleaner to handle this with NgRx and router-store, but it's a good exercise to understand the concept
  //
  // (Optional) rework effects from constructor style to "stored in private property with descriptive name" style
  // what are the advantages and disadvantages of both approaches?

  removeProduct(productId: string) {
    this.loading.set(true);
    this.#productApiService.remove(productId).subscribe({
      next: () => {
        this.#refreshTrigger.next(this.query());
        this.loading.set(false);
      },
      error: (error) => this.error.set(error?.message?.toString()),
    });
  }
}
