import { FieldTree } from '@angular/forms/signals';
import { Routes } from '@angular/router';

import { confirmDiscardUnsavedChanges } from '../../pattern/confirm-discard-unsave-changes/confirm-discard-unsaved-changes';

import { ProductApiService } from './product-api.service';
import { ProductListComponent } from './product-list/product-list.component';

export default <Routes>[
  {
    path: '',
    providers: [ProductApiService],
    children: [
      {
        path: '',
        component: ProductListComponent,
        children: [
          {
            path: 'editor',
            loadComponent: () =>
              import('./product-editor/product-editor.component').then(
                (c) => c.ProductEditorComponent,
              ),
            canDeactivate: [
              ({ form }: { form: FieldTree<unknown> }) =>
                confirmDiscardUnsavedChanges(form),
            ],
          },
          {
            path: 'editor/:productId',
            loadComponent: () =>
              import('./product-editor/product-editor.component').then(
                (c) => c.ProductEditorComponent,
              ),
            canDeactivate: [
              ({ form }: { form: FieldTree<unknown> }) =>
                confirmDiscardUnsavedChanges(form),
            ],
          },
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
