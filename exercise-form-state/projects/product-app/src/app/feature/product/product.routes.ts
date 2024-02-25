import { Routes } from '@angular/router';

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
            // TODO 19: add canDeactivate which accepts an array of guards
            // which will be implemented as an arrow function (arrow function represents inline functional guard)
            // the guard receives current component as an argument (type it with { form: AbstractControl })
            // the function will call confirmDiscardUnsavedChanges with the form property of the component
            // this abstraction allows is to reuse confirmDiscardUnsavedChanges function for components
            // which store form in a different property
          },
          {
            path: 'editor/:productId',
            loadComponent: () =>
              import('./product-editor/product-editor.component').then(
                (c) => c.ProductEditorComponent,
              ),
            // TODO 20: add canDeactivate guard to this route as well, use the approach from the previous step
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
