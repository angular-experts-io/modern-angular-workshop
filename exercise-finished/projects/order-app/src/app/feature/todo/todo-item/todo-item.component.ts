import { Component, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

import { CardComponent } from '../../../ui/card/card.component';

import { Todo } from '../todo.model';

@Component({
  selector: 'my-org-todo-item',
  imports: [CardComponent, MatIconButton, MatIcon],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss',
})
export class TodoItemComponent {
  disabled = input(false);
  todo = input.required<Todo>();

  toggle = output<Todo>();
  remove = output<Todo>();
}
