import { Component, computed, input, output } from '@angular/core';
import { Product } from '../product.model';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

@Component({
  imports: [MatIcon, MatIconButton],
  selector: 'my-org-product-item',
  styleUrl: './product-item.component.scss',
  templateUrl: './product-item.component.html',
})
export class ProductItemComponent {

  // PUBLIC API
  product = input.required<Product>();

  remove = output<string>();

  doSOmething() {
  }



  // isolated private implementaionm
  averagePrice = computed(() => {
    return (
      this.product().pricePerMonth.reduce((acc, price) => acc + price, 0) /
      this.product().pricePerMonth.length
    ).toFixed(2);
  });
}
