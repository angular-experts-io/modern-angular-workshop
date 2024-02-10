import { Routes } from '@angular/router';

import { ProductListComponent } from './product-list/product-list.component';
import { ProductService } from './product.service';
import { ProductDetailComponent } from './product-detail/product-detail.component';

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
            path: ':productId',
            component: ProductDetailComponent
          }
        ],
      },
    ],
  },
];
