import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Product } from '../product.model';
import { ProductService } from '../product.service';

import { ProductItemComponent } from './product-item.component';

describe('ProductItemComponent', () => {
  let component: ProductItemComponent;
  let fixture: ComponentFixture<ProductItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, ProductItemComponent],
      providers: [
        {
          provide: ProductService,
          useValue: {
            calculateAveragePrice() {
              return 0;
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', <Product>{
      id: 'aaa',
      name: 'Test Product',
      description: 'Test Description',
      category: 'Test Category',
      supplier: {
        name: 'Test Supplier',
        origin: 'Test Origin',
      },
      price: 100,
      quantity: 10,
      pricePerMonth: [90, 100],
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
