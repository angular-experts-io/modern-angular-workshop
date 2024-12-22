import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductItemSkeletonComponent } from './product-item-skeleton.component';

describe('ProductItemSkeletonComponent', () => {
  let component: ProductItemSkeletonComponent;
  let fixture: ComponentFixture<ProductItemSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductItemSkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductItemSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
