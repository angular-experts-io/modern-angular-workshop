import { Routes } from '@angular/router';

import { ProductService } from './product.service';
import { ProductApiService } from './product-api.service';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductEditorComponent } from './product-editor/product-editor.component';
import { confirmDiscardUnsavedChanges } from '../../pattern/confirm-discard-unsave-changes/confirm-discard-unsaved-changes';

export default <Routes>[
  {
    path: '',
    providers: [ProductService, ProductApiService],
    children: [
      {
        path: '',
        component: ProductListComponent,
        children: [
          {
            path: 'editor/:productId',
            component: ProductEditorComponent,
            canDeactivate: [
              (component: ProductEditorComponent) =>
                confirmDiscardUnsavedChanges(component.form),
            ],
          },
          {
            path: 'editor',
            component: ProductEditorComponent,
            canDeactivate: [
              (component: ProductEditorComponent) =>
                confirmDiscardUnsavedChanges(component.form),
            ],
          },
          // order matters
          {
            path: ':productId',
            component: ProductDetailComponent,
          },
        ],
      },
    ],
  },
];
