import { Component, computed, signal } from '@angular/core';

import { Product } from '../product.model';
import { products } from '../product.mock';
import { ProductItemComponent } from '../product-item/product-item.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatButton, MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatHint, MatInput, MatLabel } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'my-org-product-list',
  imports: [
    ProductItemComponent,
    MatProgressSpinner,
    MatButton,
    MatIcon,
    MatMiniFabButton,
    MatLabel,
    MatFormField,
    MatInput,
    MatHint,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent {
  products = signal<Product[] | undefined>(undefined);
  loading = signal(true);
  error = signal<string | undefined>(undefined);
  showFilter = signal(false);
  query = signal('');

  filteredProducts = computed(() => {
    return this.products()?.filter((product) =>
      product.name.toLowerCase().includes(this.query().toLowerCase()),
    );
  });

  protected handleLoad() {
    this.loading.set(true);
    setTimeout(() => {
      this.products.set(products);
      this.loading.set(false);
    }, 1000);
  }

  protected handleRemove(productId: string) {
    this.products.update((products) => {
      if (!products) {
        return products;
      } else {
        return products.filter((product) => product.id !== productId);

        // Array methods map, filter, reduce  are immutable and will return a new array without modifying the original array

        // Array methods like forEach, push, pop, shift, unshift, splice are mutable and will modify the original array
      }
    });
  }
}
