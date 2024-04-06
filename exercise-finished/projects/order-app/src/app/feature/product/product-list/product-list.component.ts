import {
  ChangeDetectionStrategy,
  Component,
  effect,
  HostListener,
  inject,
  input,
  signal,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
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

import { ChipComponent } from '../../../ui/chip/chip.component';
import { CardComponent } from '../../../ui/card/card.component';
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
  standalone: true,
  imports: [
    AsyncPipe,
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
    CardComponent,
    ChipComponent,
    ProductItemComponent,
    ProductItemSkeletonComponent,
    CardStatusComponent,
  ],
  animations: [appearAnimation, appearDownEnterLeaveAnimation],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent {
  #router = inject(Router);
  #activatedRoute = inject(ActivatedRoute);
  #dialogConfirmService = inject(DialogConfirmService);
  #productService = inject(ProductService);

  queryParamsFromUrl = input('', {
    alias: 'query',
  });

  showFilter = signal(false);
  outletActivated = signal(false);
  error = signal<string | undefined>(undefined);
  loading = signal(false);
  loadingSkeleton = signal(true);
  query = signal('');
  productsRefreshTrigger = new Subject<string>();
  products = toSignal(
    toObservable(this.query).pipe(
      mergeWith(this.productsRefreshTrigger),
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

  @HostListener('document:keydown.arrowUp', ['$event']) handleArrowUp(
    $event: KeyboardEvent,
  ) {
    $event.preventDefault();
    this.handleSelectNextOrPrev('prev');
  }
  @HostListener('document:keydown.arrowDown', ['$event']) handleArrowDown(
    $event: KeyboardEvent,
  ) {
    $event.preventDefault();
    this.handleSelectNextOrPrev('next');
  }

  constructor() {
    effect(
      () => {
        if (this.queryParamsFromUrl()) {
          this.query.set(this.queryParamsFromUrl());
          this.showFilter.set(true);
        }
      },
      { allowSignalWrites: true },
    );
    effect(() => {
      this.#router.navigate([], {
        queryParams: { query: this.query() ? this.query() : undefined },
        queryParamsHandling: 'merge',
      });
    });
  }

  toggleShowFilter() {
    this.showFilter.update((showFilter) => !showFilter);
  }

  refresh() {
    this.productsRefreshTrigger.next(this.query());
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
            next: () => this.productsRefreshTrigger.next(this.query()),
            error: (error: Error) => {
              this.error.set(error.message);
              this.loading.set(false);
            },
            complete: () => this.loading.set(false),
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
