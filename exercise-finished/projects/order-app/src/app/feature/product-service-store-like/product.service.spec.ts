import { TestBed } from '@angular/core/testing';

import { ProductService } from './product.service';
import { ProductApiService } from './product-api.service';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductService, { provide: ProductApiService, useValue: {} }],
    });
    service = TestBed.inject(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
