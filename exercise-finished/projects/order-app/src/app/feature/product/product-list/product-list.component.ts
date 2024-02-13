import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
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
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, filter } from 'rxjs';

import { ChipComponent } from '../../../ui/chip/chip.component';
import { CardComponent } from '../../../ui/card/card.component';
import { animationAppear } from '../../../ui/animation/animation.appear';
import { animationAppearDownEnterLeave } from '../../../ui/animation/animation.appear-down';
import { DialogConfirmService } from '../../../pattern/dialog-confirm/dialog-confirm.service';

import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { ProductItemComponent } from '../product-item/product-item.component';
import { ProductItemSkeletonComponent } from '../product-item-skeleton/product-item-skeleton.component';
import { CardErrorComponent } from '../../../ui/card-error/card-error.component';

@Component({
  selector: 'my-org-product-list',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    RouterOutlet,
    RouterLinkActive,
    ReactiveFormsModule,
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
    CardErrorComponent,
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

  // store like service, consider NgRx component store (or better, NgRx store)
  private productService = inject(ProductService);

  productId = signal<string | undefined>(undefined);
  showFilter = signal(false);
  products = inject(ProductService).products;

  // we wan;t everything to be signals to be future-proof
  // will be Signal model in v17.2
  fullTextSearchQuery = new FormControl('');

  constructor() {
    const query = toSignal(
      this.fullTextSearchQuery.valueChanges.pipe(debounceTime(300)),
      { initialValue: '' },
    );
    effect(
      () => {
        this.productService.loadProducts(query());
      },
      { allowSignalWrites: true },
    );
  }

  toggleShowFilter() {
    this.showFilter.update((showFilter) => !showFilter);
  }

  handleRemove(product: Product) {
    this.dialogConfirmService
      .open({
        title: 'Remove product',
        message: `Are you sure you want to remove "${product.name}" product?`,
        confirmLabel: 'Remove',
      })
      .pipe(filter(Boolean))
      .subscribe(() => this.productService.removeProduct(product.id));
  }

  handleSelectNextOrPrev(direction: 'next' | 'prev', $event: Event) {
    $event.preventDefault();
    const productId =
      this.activatedRoute.firstChild?.snapshot.paramMap.get('productId');
    if (productId) {
      this.products().products.find((p, index, products) => {
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
