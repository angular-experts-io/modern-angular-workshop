import { signal } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductStore } from '../product.store';
import { ProductDetailComponent } from './product-detail.component';

describe('ProductItemComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: ProductStore,
          useValue: {
            loading: signal(false),
            selectedProduct: signal(undefined),
            selectProduct() {},
          },
        },
      ],
      imports: [RouterTestingModule, ProductDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('productId', undefined);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
