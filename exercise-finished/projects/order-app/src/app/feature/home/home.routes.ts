import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';

export default <Routes>[
  {
    path: '',
    providers: [],
    children: [
      {
        path: '',
        component: HomeComponent,
        providers: [],
      },
    ],
  },
];
