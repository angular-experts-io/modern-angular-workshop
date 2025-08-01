import { RouterLink } from '@angular/router';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';

import { CardComponent } from '../../../ui/card/card.component';
import { ChipComponent } from '../../../ui/chip/chip.component';
import { CardStatusComponent } from '../../../ui/card-status/card-status.component';
import { ChartLineComponent } from '../../../pattern/chart-line/chart-line.component';

import { ProductService } from '../product.service';
import { ProductItemSkeletonComponent } from '../product-item-skeleton/product-item-skeleton.component';

@Component({
  selector: 'my-org-product-detail',
  imports: [
    RouterLink,
    MatIcon,
    MatButton,
    MatIconButton,
    CardComponent,
    ChipComponent,
    ChartLineComponent,
    CardStatusComponent,
    ProductItemSkeletonComponent,
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent {
  #productService = inject(ProductService);

  productId = input.required<string>();
  product = rxResource({
    params: () => this.productId(),
    stream: ({ params }) => this.#productService.findOne(params),
  });

  showPriceChart = signal(false);
  averagePrice = computed(() =>
    this.#productService.calculateAveragePrice(this.product.value()),
  );
}
