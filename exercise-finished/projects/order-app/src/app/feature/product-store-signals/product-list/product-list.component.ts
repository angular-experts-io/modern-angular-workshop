import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, JsonPipe } from '@angular/common';
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

import { ChipComponent } from '../../../ui/chip/chip.component';
import { CardComponent } from '../../../ui/card/card.component';
import { animationAppear } from '../../../ui/animation/animation.appear';
import { CardErrorComponent } from '../../../ui/card-error/card-error.component';
import { animationAppearDownEnterLeave } from '../../../ui/animation/animation.appear-down';
import { DialogConfirmService } from '../../../pattern/dialog-confirm/dialog-confirm.service';

import { Product } from '../product.model';
import { ProductStore } from '../product.store';
import { ProductItemComponent } from '../product-item/product-item.component';
import { ProductItemSkeletonComponent } from '../product-item-skeleton/product-item-skeleton.component';
import { toSignal } from '@angular/core/rxjs-interop';

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
    CardErrorComponent,
    JsonPipe,
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

  store = inject(ProductStore);
  showFilter = signal(false);
  outletActivated = signal(false);

  constructor() {
    const queryParams = toSignal(this.activatedRoute.queryParams);
    effect(
      () => {
        const query = queryParams()?.['query'] ?? '';
        this.store.updateQuery(query);
        if (query) {
          this.showFilter.set(true);
        }
      },
      { allowSignalWrites: true },
    );
  }

  handleQueryChange(query: string) {
    this.router.navigate([], {
      queryParams: { query },
      queryParamsHandling: 'merge',
    });
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
          this.store.removeOptimistic(product.id);
        }
      },
    );
  }

  handleSelectNextOrPrev(direction: 'next' | 'prev', $event: Event) {
    $event.preventDefault();
    if (this.store.selectedProduct()) {
      const targetProductId =
        direction === 'next'
          ? this.store.nextProductId()
          : this.store.prevProductId();
      this.router.navigate([targetProductId], {
        relativeTo: this.activatedRoute,
        queryParamsHandling: 'merge',
      });
    }
  }
}
