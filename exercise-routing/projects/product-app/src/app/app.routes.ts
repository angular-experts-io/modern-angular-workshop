import { Routes } from '@angular/router';

export const routes: Routes = [
  // TODO 2: let's add an route that matches empty path and redirects to home
  // hint: the route has to specify pathMatch (see inline docs for more info)
  // try it in running app and see if it works by navigating to http://localhost:4200
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    loadChildren: () => import('./feature/home/home.routes'),
  },
  {
    path: 'product',
    loadChildren: () => import('./feature/product/product.routes'),
  },
  // TODO 3: let's add a route that matches any path ** and redirects to home
  // this can be also used to display dedicated "not found" page
  // try it in running app and see if it works by navigating to http://localhost:4200/wrong
  {
    path: '**',
    redirectTo: 'home',
  }
];
