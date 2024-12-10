import { Routes } from '@angular/router';

import { ProductApiService } from './product-api.service';
import { ProductListComponent } from './product-list/product-list.component';

export default <Routes>[
  {
    path: '',
    providers: [ProductApiService],
    children: [
      // TODO 4: define route for product details which consists of dynamic productId
      // on which level should we define it if we want to display product list and detail
      // at the same time? (use component based lazy loading)
      {
        path: '',
        component: ProductListComponent,
        children: [
          {
            path: 'editor',
            loadComponent: () =>
              import('./product-editor/product-editor.component').then(
                (m) => m.ProductEditorComponent,
              ),
          },
          {
            path: 'editor/:productId',
            loadComponent: () =>
              import('./product-editor/product-editor.component').then(
                (m) => m.ProductEditorComponent,
              ),
          },
          {
            path: ':productId',
            loadComponent: () =>
              import('./product-detail/product-detail.component').then(
                (m) => m.ProductDetailComponent,
              ),
          },
        ],
      },
      // TODO 15: let's create a new "product-editor" component using Angular Schematics (IDE integration)
      // add two routes for the editor, "editor" for creating new product and "editor/:productId" for editing
      // on which level should we define the routes if we want to display product list and editor at the same time?
      // what needs to be the final order of these routes for matching to work correctly?
    ],
  },
];
