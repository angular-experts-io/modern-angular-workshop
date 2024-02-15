import { RouterLink } from '@angular/router';
import { Component, input, model, ModelSignal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { CardComponent } from '../../../ui/card/card.component';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatInput, MatLabel } from '@angular/material/input';
import { Product } from '../product.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'my-org-product-editor',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    MatIcon,
    MatInput,
    MatLabel,
    MatIconButton,
    MatFormField,
    MatError,
    CardComponent,
  ],
  templateUrl: './product-editor.component.html',
  styleUrl: './product-editor.component.scss',
})
export class ProductEditorComponent {
  productId = input<string | undefined>();
  product: { [key in keyof Product]: ModelSignal<Product[key]> } = {
    id: model<string>(''),
    name: model<string>(''),
    category: model<string>(''),
    description: model<string>(''),
    price: model<number>(0),
    pricePerMonth: model<number[]>([]),
    quantity: model<number>(0),
    supplier: model<string>(''),
  };
}
