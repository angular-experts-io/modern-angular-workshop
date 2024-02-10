import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

import { CardComponent } from '../../../ui/card/card.component';
import { ChipComponent } from '../../../ui/chip/chip.component';
import { appearAnimation } from '../../../ui/animation/appear.animation';

import { ProductService } from '../product.service';

@Component({
  selector: 'my-org-product-list',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    RouterLinkActive,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinner,
    CardComponent,
    ChipComponent,
  ],
  animations: [appearAnimation],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);

  products = inject(ProductService).products;

  ngOnInit() {
    this.productService.loadProducts();
  }
}
