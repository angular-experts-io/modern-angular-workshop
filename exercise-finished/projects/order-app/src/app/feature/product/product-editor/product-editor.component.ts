import { RouterLink } from '@angular/router';
import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { CardComponent } from '../../../ui/card/card.component';

@Component({
  selector: 'my-org-product-editor',
  standalone: true,
  imports: [MatIcon, MatIconButton, RouterLink, CardComponent],
  templateUrl: './product-editor.component.html',
  styleUrl: './product-editor.component.scss',
})
export class ProductEditorComponent {
  productId = input<string | undefined>();
}
