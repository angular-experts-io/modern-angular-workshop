import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
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
    const productId =
      this.activatedRoute.firstChild?.snapshot.paramMap.get('productId');
    if (productId) {
      this.store.products()?.find((p, index, products) => {
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
