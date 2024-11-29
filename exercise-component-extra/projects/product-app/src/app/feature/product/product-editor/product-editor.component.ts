import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'my-org-product-editor',
  imports: [MatIcon, MatIconButton, RouterLink],
  templateUrl: './product-editor.component.html',
  styleUrl: './product-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductEditorComponent {
  productId = input<string>();
}
