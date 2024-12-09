import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  MatFormField,
  MatHint,
  MatInput,
  MatLabel,
  MatSuffix,
} from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  catchError,
  debounceTime,
  mergeWith,
  Subject,
  switchMap,
  tap,
} from 'rxjs';

import { appearAnimation } from '../../../ui/animation/appear.animation';
import { CardStatusComponent } from '../../../ui/card-status/card-status.component';
import { appearDownEnterLeaveAnimation } from '../../../ui/animation/appear-down.animation';
import { DialogConfirmService } from '../../../pattern/dialog-confirm/dialog-confirm.service';

import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { ProductItemComponent } from '../product-item/product-item.component';
import { ProductItemSkeletonComponent } from '../product-item-skeleton/product-item-skeleton.component';

@Component({
  selector: 'my-org-product-list',
  imports: [
    FormsModule,
    RouterLink,
    RouterOutlet,
    RouterLinkActive,
    MatHint,
    MatInput,
    MatLabel,
    MatSuffix,
    MatFormField,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinner,
    ProductItemComponent,
    ProductItemSkeletonComponent,
    CardStatusComponent,
  ],
  animations: [appearAnimation, appearDownEnterLeaveAnimation],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.arrowUp)': 'handleArrowUp($event)',
    '(document:keydown.arrowDown)': 'handleArrowDown($event)',
  },
})
export class ProductListComponent {
  #router = inject(Router);
  #activatedRoute = inject(ActivatedRoute);
  #dialogConfirmService = inject(DialogConfirmService);
  #productService = inject(ProductService);
  #productsRefreshTrigger = new Subject<string>();

  queryParamsFromUrl = input(undefined, {
    alias: 'query',
  });
  showFilter = linkedSignal({
    source: () => !!this.queryParamsFromUrl(),
    computation: (source, previous) => previous ?? source,
  });
  query = linkedSignal(() => this.queryParamsFromUrl() ?? '');

  outletActivated = signal(false);
  error = signal<string | undefined>(undefined);
  loading = signal(false);
  loadingSkeleton = signal(true);
  products = toSignal(
    toObservable(this.query).pipe(
      mergeWith(this.#productsRefreshTrigger),
      debounceTime(300),
      tap(() => {
        if (this.products()?.length > 0) {
          this.loading.set(true);
        } else {
          this.loadingSkeleton.set(true);
        }
        this.error.set(undefined);
      }),
      switchMap((query) =>
        this.#productService.find(query).pipe(
          catchError((error) => {
            this.error.set(error.message);
            return [[]]; // same as of([]), [] fulfills ObservableInput interface
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

  #effectSyncQueryToUrl = effect(() => {
    this.#router.navigate([], {
      queryParams: { query: this.query() ? this.query() : undefined },
      queryParamsHandling: 'merge',
    });
  });

  handleArrowUp($event: KeyboardEvent) {
    $event.preventDefault();
    this.handleSelectNextOrPrev('prev');
  }

  handleArrowDown($event: KeyboardEvent) {
    $event.preventDefault();
    this.handleSelectNextOrPrev('next');
  }

  toggleShowFilter() {
    this.showFilter.update((showFilter) => !showFilter);
  }

  refresh() {
    this.#productsRefreshTrigger.next(this.query());
  }

  handleRemove(product: Product) {
    this.#dialogConfirmService.open(
      {
        title: 'Remove product',
        message: `Are you sure you want to remove "${product.name}" product?`,
        confirmLabel: 'Remove',
      },
      (result) => {
        if (result) {
          this.loading.set(true);
          this.#productService.remove(product.id).subscribe({
            next: () => this.#productsRefreshTrigger.next(this.query()),
            error: (error: Error) => {
              this.error.set(error.message);
            },
          });
        }
      },
    );
  }

  handleSelectNextOrPrev(direction: 'next' | 'prev') {
    const productId =
      this.#activatedRoute.firstChild?.snapshot.paramMap.get('productId');
    if (productId) {
      this.products()?.find((p, index, products) => {
        if (p.id === productId) {
          let destinationProduct: Product;
          if (direction === 'next') {
            destinationProduct = products[index + 1] ?? products[0];
          } else {
            destinationProduct =
              products[index - 1] ?? products[products.length - 1];
          }
          this.#router.navigate([destinationProduct.id], {
            relativeTo: this.#activatedRoute,
          });
        }
      });
    }
  }
}
