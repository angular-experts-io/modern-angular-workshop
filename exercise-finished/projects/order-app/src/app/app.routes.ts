import { Routes } from '@angular/router';

export const routes: Routes = [
  // {
  //   path: '',
  //   pathMatch: 'full',
  //   redirectTo: 'home',
  // },
  {
    path: 'home',
    loadChildren: () => import('./feature/home/home.routes'),
  },
  {
    path: 'product',
    loadChildren: () => import('./feature/product/product.routes'),
  },
  {
    path: 'product-service-store-like',
    loadChildren: () =>
      import('./feature/product-service-store-like/product.routes'),
  },
  {
    path: 'product-store-signals',
    loadChildren: () =>
      import('./feature/product-store-signals/product.routes'),
  },
];
