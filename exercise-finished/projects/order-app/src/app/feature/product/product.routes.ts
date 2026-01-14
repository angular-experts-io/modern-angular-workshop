import { Routes } from '@angular/router';
import { FieldTree } from '@angular/forms/signals';

import { confirmDiscardUnsavedChanges } from '../../pattern/confirm-discard-unsave-changes/confirm-discard-unsaved-changes';

import { ProductService } from './product.service';

export default <Routes>[
  {
    path: '',
    providers: [ProductService],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./product-list/product-list.component').then(
            (m) => m.ProductListComponent,
          ),
        children: [
          {
            path: 'editor/:productId',
            loadComponent: () =>
              import('./product-editor/product-editor.component').then(
                (c) => c.ProductEditorComponent,
              ),
            canDeactivate: [
              (component: { form: FieldTree<unknown> }) =>
                confirmDiscardUnsavedChanges(component.form),
            ],
          },
          {
            path: 'editor',
            loadComponent: () =>
              import('./product-editor/product-editor.component').then(
                (c) => c.ProductEditorComponent,
              ),
            canDeactivate: [
              (component: { form: FieldTree<unknown> }) =>
                confirmDiscardUnsavedChanges(component.form),
            ],
          },
          // order matters
          {
            path: ':productId',
            loadComponent: () =>
              import('./product-detail/product-detail.component').then(
                (c) => c.ProductDetailComponent,
              ),
          },
        ],
      },
    ],
  },
];
