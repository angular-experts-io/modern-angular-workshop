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
})
export class ProductListComponent {
  #router = inject(Router);
  #productApiService = inject(ProductApiService);
  #refreshTrigger = new Subject<string>();

  queryParamsFromUrl = input('', {
    alias: 'query',
  });

  showFilter = signal(false);
  query = signal<string>('');

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
    effect(
      () => {
        if (this.queryParamsFromUrl()) {
          this.query.set(this.queryParamsFromUrl());
          this.showFilter.set(true);
        }
      },
      
    );
    effect(() => {
      this.#router.navigate([], {
        queryParams: { query: this.query() ? this.query() : undefined },
        queryParamsHandling: 'merge',
      });
    });
  }

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
