import { signal } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductService } from '../product.service';
import { ProductDetailComponent } from './product-detail.component';

describe('ProductItemComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: ProductService,
          useValue: {
            loading: signal(false),
            selectedProduct: signal({}),
            selectedProductId: signal(undefined),
            selectProduct() {},
            updateSelectedProductId() {},
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
