import {
  ChangeDetectionStrategy,
  Component,
  inject,
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
import { ProductApiService } from '../product-api.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, mergeWith, Subject, switchMap, tap } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

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
      switchMap((query) => this.productApiService.find(query).pipe(
        catchError(error => {
          this.error.set(error?.message?.toString());
          return [[]];
        })
      )),
      tap(() => {
        this.loading.set(false);
        this.loadingSkeleton.set(false)
      }),
    ),
    { initialValue: [] },
  );

  removeProduct(productId: string) {
    this.loading.set(true);
    this.productApiService.remove(productId).subscribe({
      next: () => {
        this.refreshTrigger.next(this.query())
        this.loading.set(false);
      },
      error: (error) => this.error.set(error?.message?.toString()),
    });
  }
}
