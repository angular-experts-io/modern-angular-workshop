import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { CardComponent } from '../../../ui/card/card.component';
import { ChipComponent } from '../../../ui/chip/chip.component';

@Component({
  selector: 'my-org-product-item-skeleton',
  imports: [CardComponent, ChipComponent],
  templateUrl: './product-item-skeleton.component.html',
  styleUrl: './product-item-skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductItemSkeletonComponent {
  repeatCount = input(1);
}
