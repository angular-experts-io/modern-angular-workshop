import { v4 } from 'uuid';
import { FormsModule } from '@angular/forms';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  MatFormField,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatFabButton, MatIconButton } from '@angular/material/button';

import { crudResource } from '../../../core/util/crud-resource';

import { Todo } from '../todo.model';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { TodoItemSkeletonComponent } from '../todo-item-skeleton/todo-item-skeleton.component';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';

@Component({
  selector: 'my-org-todo',
  imports: [
    FormsModule,
    MatIcon,
    MatInput,
    MatLabel,
    MatSuffix,
    MatFormField,
    MatFabButton,
    MatIconButton,
    MatProgressSpinner,
    TodoItemComponent,
    TodoItemSkeletonComponent,
    MatButtonToggleGroup,
    MatButtonToggle,
  ],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoComponent {


  /**
   * TODO
   *
   * single item mode
   * ID frontend vs backend
   *
   *
   */

  todos = crudResource<Todo, string>(`/todos`, {
    params: () => `?_page=1&_limit=${this.limit()}`,
    update: {
      behavior: 'merge',
      strategy: 'optimistic'
    },
    remove: {
      strategy: 'optimistic',
      behavior: 'merge',
    }
  });


  limit = signal(5);

  newTodo = signal('');

  create() {
    const title = this.newTodo();
    this.newTodo.set('');
    this.todos.create({ id: v4(), title, completed: false });
  }

  toggle(todo: Todo) {
    this.todos.update(todo.id, { ...todo, completed: !todo.completed });
  }

  remove(todo: Todo) {
    this.todos.remove(todo.id);
  }
}
