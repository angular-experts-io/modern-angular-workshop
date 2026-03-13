import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { httpResource } from '@angular/common/http';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatHint, MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatMiniFabButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

import { Product } from '../product.model';
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

  queryParamsFromUrl = input('', {
    alias: 'query',
  });

  query = linkedSignal(() => this.queryParamsFromUrl() ?? '');
  showFilter = linkedSignal({
    source: () => !!this.queryParamsFromUrl(),
    computation: (source, previous) => previous?.value || source,
  });
  productsResource = httpResource<Product[]>(() => `/products?q=${this.query()}`);
  loading = linkedSignal(() => this.productsResource.isLoading());
  products = linkedSignal<Product[], Product[]>({
    source: () => this.productsResource.value() ?? [],
    computation: (next, prev) => {
      if (this.productsResource.isLoading()) {
        return prev?.source ?? [];
      } else {
        return next;
      }
    },
  });

  #effectSyncQueryToUrl = effect(() => {
    this.#router.navigate([], {
      queryParams: { query: this.query() ? this.query() : undefined },
    });
  });

  removeProduct(productId: string) {
    this.loading.set(true);
    this.#productApiService
      .remove(productId)
      .subscribe(() => this.productsResource.reload());
  }
}
