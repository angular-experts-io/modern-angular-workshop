import { Routes } from '@angular/router';

import { ProductListComponent } from './product-list/product-list.component';
import { ProductApiService } from './product-api.service';

export default <Routes>[
  {
    path: '',
    providers: [ProductApiService],
    children: [
      {
        path: '',
        component: ProductListComponent,
      },
    ],
  },
];
