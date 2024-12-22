import { Component } from '@angular/core';

import { CardComponent } from '../../../ui/card/card.component';

@Component({
  selector: 'my-org-product-editor-skeleton',
  imports: [CardComponent],
  templateUrl: './product-editor-skeleton.component.html',
  styleUrl: './product-editor-skeleton.component.scss',
})
export class ProductEditorSkeletonComponent {}
