import { Component } from '@angular/core';

import { CardComponent } from '../../../ui/card/card.component';

@Component({
  selector: 'my-org-todo-item-skeleton',
  imports: [CardComponent],
  templateUrl: './todo-item-skeleton.component.html',
  styleUrl: './todo-item-skeleton.component.scss',
})
export class TodoItemSkeletonComponent {}
