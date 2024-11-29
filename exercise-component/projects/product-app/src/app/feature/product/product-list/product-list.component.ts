import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'my-org-product-list',
  imports: [ProductItemComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent {}
