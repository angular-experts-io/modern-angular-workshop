import { Routes } from '@angular/router';

import { ProductComponent } from './product/product.component';

export default <Routes>[
  {
    path: '',
    providers: [],
    children: [
      {
        path: '',
        component: ProductComponent,
      },
    ],
  },
];
