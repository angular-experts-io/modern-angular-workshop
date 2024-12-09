import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
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

import {
  appearDown,
  appearDownEnterLeave,
} from '../../../ui/animation/appear-down.animation';

import { ProductApiService } from '../product-api.service';
import { ProductItemComponent } from '../product-item/product-item.component';
import { ProductItemSkeletonComponent } from '../product-item-skeleton/product-item-skeleton.component';

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
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [appearDown, appearDownEnterLeave],
})
export class ProductListComponent {
  #router = inject(Router);
  #productApiService = inject(ProductApiService);
  #refreshTrigger = new Subject<string>();
  // TODO 12: inject the ProductService into the component (protected, we need template access)

  // TODO 21: inject DialogConfirmService into the component (private) (and remove unused injections)

  queryParamsFromUrl = input('', {
    alias: 'query',
  });

  // TODO 17: let's remove the query signal and replace its use in the service
  // with productService.query and the productService.updateQuery method
  query = signal<string>('');
  showFilter = signal(false);
  outletActivated = signal(false);
  // TODO 19: see how little state is left in the component!

  // TODO 14: remove the loading, loadingSkeleton, error and products signals
  loading = signal<boolean>(false);
  loadingSkeleton = signal<boolean>(true);
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

  constructor() {
    // this is something which would be abstracted away from the component by proper @ngrx/effects
    // especially with the help of the @ngrx/router-store
    // the idea is that components should have basically 0 actual logic and therefore 0 tests
    effect(
      () => {
        if (this.queryParamsFromUrl()) {
          this.query.set(this.queryParamsFromUrl());
          this.showFilter.set(true);
        }
      },
      
    );
    effect(() => {
      if (this.query()) {
        this.#router.navigate([], {
          queryParams: { query: this.query() },
          queryParamsHandling: 'merge',
        });
      }
    });
  }

  removeProduct(productId: string) {
    // TODO 13: remove the implementation of the removeProduct method and keep it empty
    this.loading.set(true);
    this.#productApiService.remove(productId).subscribe({
      next: () => {
        this.#refreshTrigger.next(this.query());
        this.loading.set(false);
      },
      error: (error) => this.error.set(error?.message?.toString()),
    });

    // TODO 22: use the DialogConfirmService and use its open (not open$) method
    // to confirm the product removal and once confirmed, call the productService.remove method
    // try it out in the running app
  }

  // TODO 1: in the running app, open first item in the editor, change its name and save it
  // check out the same item in the list, what is the problem with this solution?

  // TODO 2: add refresh method which is going to emit next event on refreshTrigger
  // with the current query value
}
