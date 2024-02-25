import { Routes } from '@angular/router';
import { AbstractControl } from '@angular/forms';

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
              (component: { form: AbstractControl }) =>
                confirmDiscardUnsavedChanges(component.form),
            ],
          },
          {
            path: 'editor/:productId',
            loadComponent: () =>
              import('./product-editor/product-editor.component').then(
                (c) => c.ProductEditorComponent,
              ),
            canDeactivate: [
              (component: { form: AbstractControl }) =>
                confirmDiscardUnsavedChanges(component.form),
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
