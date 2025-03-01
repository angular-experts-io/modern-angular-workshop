import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoItemSkeletonComponent } from './todo-item-skeleton.component';

describe('TodoItemSkeletonComponent', () => {
  let component: TodoItemSkeletonComponent;
  let fixture: ComponentFixture<TodoItemSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoItemSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoItemSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
