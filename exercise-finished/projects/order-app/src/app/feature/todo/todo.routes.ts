import { Routes } from '@angular/router';

export default <Routes>[
  {
    path: '',
    providers: [],
    children: [
      {
        path: '',
        loadComponent: () => import('./todo/todo.component').then((m) => m.TodoComponent),
      },
    ],
  },
];
