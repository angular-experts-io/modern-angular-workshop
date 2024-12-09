import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { appearAnimation } from '../../../ui/animation/appear.animation';
import { CardStatusComponent } from '../../../ui/card-status/card-status.component';
import { appearDownEnterLeaveAnimation } from '../../../ui/animation/appear-down.animation';
import { DialogConfirmService } from '../../../pattern/dialog-confirm/dialog-confirm.service';

import { Product } from '../product.model';
import { ProductStore } from '../product.store';
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
    CardStatusComponent,
    ProductItemComponent,
    ProductItemSkeletonComponent,
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

  store = inject(ProductStore);

  queryParamsFromUrl = input(undefined, {
    alias: 'query',
  });
  showFilter = linkedSignal({
    source: () => !!this.queryParamsFromUrl(),
    computation: (source, previous) => previous ?? source,
  });
  outletActivated = signal(false);

  handleArrowUp($event: KeyboardEvent) {
    $event.preventDefault();
    this.handleSelectNextOrPrev('prev');
  }

  handleArrowDown($event: KeyboardEvent) {
    $event.preventDefault();
    this.handleSelectNextOrPrev('next');
  }

  #effectSyncQueryFromQueryParamsToStore = effect(() => {
    const query = this.queryParamsFromUrl();
    if (query) {
      this.store.updateQuery(query);
    }
  });

  handleQueryChange(query: string) {
    this.store.updateQuery(query);
    this.#router.navigate([], {
      queryParams: { query: query ? query : undefined },
      queryParamsHandling: 'merge',
    });
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
          this.store.removeOptimistic(product.id);
        }
      },
    );
  }

  handleSelectNextOrPrev(direction: 'next' | 'prev') {
    if (this.store.selectedProduct()) {
      const targetProductId =
        direction === 'next'
          ? this.store.nextProductId()
          : this.store.prevProductId();
      this.#router.navigate([targetProductId], {
        relativeTo: this.#activatedRoute,
        queryParamsHandling: 'merge',
      });
    } else if (this.store.products().length) {
      this.#router.navigate([this.store.products()[0].id], {
        relativeTo: this.#activatedRoute,
        queryParamsHandling: 'merge',
      });
    }
  }
}
