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
    MatProgressSpinner,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent {
  private productApiService = inject(ProductApiService);
  private refreshTrigger = new Subject<string>();

  showFilter = signal(false);
  query = signal<string>('');

  loading = signal<boolean>(false);
  loadingSkeleton = signal<boolean>(true);
  error = signal<string | undefined>(undefined);

  products = toSignal(
    toObservable(this.query).pipe(
      mergeWith(this.refreshTrigger),
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
        this.productApiService.find(query).pipe(
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
  // first, let's inject the Router and ActivatedRoute injectables
  // lets define a constructor which will allow us to use Angular Signals "effect"
  // in the effect we will use router.navigate() method and navigate to the same route []
  // in the second, options object argument, we;re going to specify queryParams
  // with query assigned to this.query() signal value
  // next we're going to specify queryParamsHandling to "merge" to not lose other query params
  // let's try it in the running app, the URL should now reflect the query signal value

  // TODO 14: reflecting URL query param state to UI state
  // now we need to define a new signal queryParamsFromUrl which will be derived
  // from the ActivatedRoute.queryParams using toSignal() function and store it in the component property
  // after we're going to define one more effect which will be triggered when queryParamsFromUrl signal changes
  // in the effect we're going to check if the queryParamsFromUrl has query key
  // if it does, we're going to set the query signal value to the value of the query key (from URL query params)
  // the effect is setting a signal value, so we will need to provide additional configuration, error will provide a hint
  // does the order of effects matter? why? (try adding log statements to the effects and see it in the console)

  // summary: it's much better and cleaner to handle this with NgRx and router-store, but it's a good exercise to understand the concept

  removeProduct(productId: string) {
    this.loading.set(true);
    this.productApiService.remove(productId).subscribe({
      next: () => {
        this.refreshTrigger.next(this.query());
        this.loading.set(false);
      },
      error: (error) => this.error.set(error?.message?.toString()),
    });
  }
}