import { Routes } from '@angular/router';

import { ProductListComponent } from './product-list/product-list.component';

export default <Routes>[
  {
    path: '',
    providers: [],
    children: [
      {
        path: '',
        component: ProductListComponent,
      },
    ],
  },
];
