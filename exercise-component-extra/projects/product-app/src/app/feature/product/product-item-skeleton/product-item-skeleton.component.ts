import { Component } from '@angular/core';

import { CardComponent } from '../../../ui/card/card.component';
import { ChipComponent } from '../../../ui/chip/chip.component';

@Component({
  selector: 'my-org-product-item-skeleton',
  standalone: true,
  imports: [CardComponent, ChipComponent],
  templateUrl: './product-item-skeleton.component.html',
  styleUrl: './product-item-skeleton.component.scss',
})
export class ProductItemSkeletonComponent {}
