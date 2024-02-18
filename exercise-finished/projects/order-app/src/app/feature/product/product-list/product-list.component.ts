import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
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
import { animationAppear } from '../../../ui/animation/animation.appear';
import { CardStatusComponent } from '../../../ui/card-status/card-status.component';
import { animationAppearDownEnterLeave } from '../../../ui/animation/animation.appear-down';
import { DialogConfirmService } from '../../../pattern/dialog-confirm/dialog-confirm.service';

import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { ProductItemComponent } from '../product-item/product-item.component';
import { ProductItemSkeletonComponent } from '../product-item-skeleton/product-item-skeleton.component';
import { FormsModule } from '@angular/forms';

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
  animations: [animationAppear, animationAppearDownEnterLeave],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private dialogConfirmService = inject(DialogConfirmService);

  private productService = inject(ProductService);

  showFilter = signal(false);
  error = signal<string | undefined>(undefined);
  loading = signal(false);
  query = model('');
  productsRefreshTrigger = new Subject<string>();
  products = toSignal(
    toObservable(this.query).pipe(
      mergeWith(this.productsRefreshTrigger),
      debounceTime(300),
      tap(() => {
        this.loading.set(true);
        this.error.set(undefined);
      }),
      switchMap((query) =>
        this.productService.find(query).pipe(
          catchError((error) => {
            this.error.set(error.message);
            return [[]]; // same as of([]), [] fulfills ObservableInput interface
          }),
        ),
      ),
      tap(() => this.loading.set(false)),
    ),
    { initialValue: [] },
  );

  toggleShowFilter() {
    this.showFilter.update((showFilter) => !showFilter);
  }

  handleRemove(product: Product) {
    this.dialogConfirmService.open(
      {
        title: 'Remove product',
        message: `Are you sure you want to remove "${product.name}" product?`,
        confirmLabel: 'Remove',
      },
      (result) => {
        if (result) {
          this.productService.remove(product.id).subscribe(() => {
            this.productsRefreshTrigger.next(this.query());
          });
        }
      },
    );
  }

  handleSelectNextOrPrev(direction: 'next' | 'prev', $event: Event) {
    $event.preventDefault();
    const productId =
      this.activatedRoute.firstChild?.snapshot.paramMap.get('productId');
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
          this.router.navigate([destinationProduct.id], {
            relativeTo: this.activatedRoute,
          });
        }
      });
    }
  }
}
