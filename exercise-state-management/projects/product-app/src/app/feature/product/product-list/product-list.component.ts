import { Component, effect, inject, input, linkedSignal, signal } from '@angular/core';
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
})
export class ProductListComponent {
  #router = inject(Router);
  #productApiService = inject(ProductApiService);
  // TODO 12: inject the ProductService into the component (protected, we need template access)

  // TODO 21: inject DialogConfirmService into the component (private) (and remove unused injections)

  queryParamsFromUrl = input('', {
    alias: 'query',
  });

  // TODO 17: let's remove the query signal and replace its use in the component
  // with productService.query and the productService.updateQuery method
  // initialize and update service query from queryParamsFromUrl using an effect
  // read queryParamsFromUrl in the effect, then call updateQuery(query ?? '') inside untracked
  // update the existing URL synchronization effect to read productService.query()
  // keep showFilter and outletActivated local to the component
  query = linkedSignal(() => this.queryParamsFromUrl() ?? '');
  showFilter = linkedSignal({
    source: () => !!this.queryParamsFromUrl(),
    computation: (source, previous) => previous?.value || source,
  });
  outletActivated = signal(false);
  // TODO 19: see how little state is left in the component!
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

  // TODO 14: remove productsResource and the local loading and products signals
  // update refresh() to call productService.loadByQuery(productService.query())
  // keep the query signal and URL synchronization effect until TODO 17
  // remove imports that are no longer used; the next step updates the template
  #effectSyncQueryToUrl = effect(() => {
    this.#router.navigate([], {
      queryParams: { query: this.query() ? this.query() : undefined },
    });
  });

  async removeProduct(productId: string) {
    // TODO 13: remove the implementation of the removeProduct method and keep it empty
    this.loading.set(true);
    try {
      await this.#productApiService.remove(productId);
      this.productsResource.reload();
    } catch {
      this.loading.set(false);
    }

    // TODO 22: use the DialogConfirmService and use its open (not open$) method
    // to confirm the product removal and once confirmed, call the productService.remove method
    // try it out in the running app
  }

  // TODO 1: in the running app, open first item in the editor, change its name and save it
  // check out the same item in the list, what is the problem with this solution?

  // TODO 2: add refresh() which calls productsResource.reload()
  // the resource already uses the current query signal to build its request
}
