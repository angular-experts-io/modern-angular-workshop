import { Routes } from '@angular/router';

import { ProductListComponent } from './product-list/product-list.component';
import { ProductService } from './product.service';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductEditorComponent } from './product-editor/product-editor.component';

export default <Routes>[
  {
    path: '',
    providers: [ProductService],
    children: [
      {
        path: '',
        component: ProductListComponent,
        children: [
          {
            path: 'editor/:productId',
            component: ProductEditorComponent,
          },
          {
            path: 'editor',
            component: ProductEditorComponent,
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
