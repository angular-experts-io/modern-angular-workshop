import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
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
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, startWith } from 'rxjs';

import { CardStatusComponent } from '../../../ui/card-status/card-status.component';
import { DialogConfirmService } from '../../../pattern/dialog-confirm/dialog-confirm.service';

import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { ProductItemComponent } from '../product-item/product-item.component';
import { ProductItemSkeletonComponent } from '../product-item-skeleton/product-item-skeleton.component';

@Component({
  selector: 'my-org-product-list',
  imports: [
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
    CardStatusComponent,
    ProductItemComponent,
    ProductItemSkeletonComponent,
  ],
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

  productId = input<string | undefined>();
  queryParamsFromUrl = input(undefined, {
    alias: 'query',
  });

  showFilter = linkedSignal({
    source: () => !!this.queryParamsFromUrl(),
    computation: (source, previous) => previous ?? source,
  });
  query = linkedSignal(() => this.queryParamsFromUrl() ?? '');
  debouncedQuery = toSignal(
    toObservable(this.query).pipe(debounceTime(300), startWith(this.query())),
  );

  products = rxResource({
    defaultValue: [],
    params: this.debouncedQuery,
    stream: ({ params }) => this.#productService.find(params),
  });

  // currently, we have to provide explicit generic type
  productsList = linkedSignal<Product[], Product[]>({
    source: () => this.products.value(),
    computation: (source, previous) =>
      this.products.status() === 'loading' && previous ? previous.source : source,
  });

  #effectSyncQueryToUrl = effect(() => {
    this.#router.navigate([], {
      queryParams: { query: this.query() ? this.query() : undefined },
    });
  });

  handleArrowUp($event: Event) {
    $event.preventDefault();
    this.handleSelectNextOrPrev('prev');
  }

  handleArrowDown($event: Event) {
    $event.preventDefault();
    this.handleSelectNextOrPrev('next');
  }

  toggleShowFilter() {
    this.showFilter.update((showFilter) => !showFilter);
  }

  reload() {
    this.products.reload();
  }

  handleRemove(product: Product) {
    this.#dialogConfirmService.open(
      {
        title: 'Remove product',
        message: `Are you sure you want to remove "${product.name}" product?`,
        confirmLabel: 'Remove',
      },
      async (result) => {
        if (result) {
          await this.#productService.remove(product.id);
          this.products.reload();
        }
      },
    );
  }

  handleSelectNextOrPrev(direction: 'next' | 'prev') {
    const productId = this.#activatedRoute.firstChild?.snapshot.paramMap.get('productId');
    if (productId) {
      this.products.value().find((p, index, products) => {
        if (p.id === productId) {
          let destinationProduct: Product;
          if (direction === 'next') {
            destinationProduct = products[index + 1] ?? products[0];
          } else {
            destinationProduct = products[index - 1] ?? products[products.length - 1];
          }
          this.#router.navigate([destinationProduct.id], {
            relativeTo: this.#activatedRoute,
          });
        }
      });
    }
  }
}
