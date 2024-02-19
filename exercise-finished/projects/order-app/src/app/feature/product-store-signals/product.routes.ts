import { Routes } from '@angular/router';

import { confirmDiscardUnsavedChanges } from '../../pattern/confirm-discard-unsave-changes/confirm-discard-unsaved-changes.guard';

import { ProductStore } from './product.store';
import { ProductService } from './product.service';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductEditorComponent } from './product-editor/product-editor.component';

export default <Routes>[
  {
    path: '',
    providers: [ProductStore, ProductService],
    children: [
      {
        path: '',
        component: ProductListComponent,
        children: [
          {
            path: 'editor/:productId',
            component: ProductEditorComponent,
            // factory to decouple specific prop that stores form in a component
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
