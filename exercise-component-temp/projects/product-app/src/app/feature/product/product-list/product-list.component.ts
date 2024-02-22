import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatHint, MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatButton, MatMiniFabButton } from '@angular/material/button';

import { Product } from '../product.model';
import { products } from '../product.mock';
import { ProductItemComponent } from '../product-item/product-item.component';

@Component({
  selector: 'my-org-product-list',
  standalone: true,
  imports: [
    FormsModule,
    MatIcon,
    MatHint,
    MatInput,
    MatLabel,
    MatButton,
    MatFormField,
    MatMiniFabButton,
    ProductItemComponent,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent {
  products = signal<Product[] | undefined>(undefined);
  loading = signal<boolean>(true);
  error = signal<string | undefined>(undefined);
  showFilter = signal(false);
  query = signal<string>('');

  filteredProducts = computed(() => {
    const products = this.products();
    if (!products) {
      return undefined;
    } else {
      return products.filter((product) =>
        product.name.toLowerCase().includes(this.query()?.toLowerCase()),
      );
    }
  });

  mockLoadData() {
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
      this.products.set(products);
    }, 1000);
  }

  removeProduct(productId: string) {
    this.products.update((products) => {
      return products?.filter((product) => product.id !== productId);
    });
  }
}
