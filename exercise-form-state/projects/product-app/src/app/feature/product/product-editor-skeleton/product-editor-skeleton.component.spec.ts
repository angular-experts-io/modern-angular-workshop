import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductEditorSkeletonComponent } from './product-editor-skeleton.component';

describe('ProductEditorSkeletonComponent', () => {
  let component: ProductEditorSkeletonComponent;
  let fixture: ComponentFixture<ProductEditorSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductEditorSkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductEditorSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
