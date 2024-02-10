import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'my-org-product-detail',
  standalone: true,
  imports: [RouterLink, MatIcon, MatIconButton],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent {
  productId = input<string | undefined>();
}
