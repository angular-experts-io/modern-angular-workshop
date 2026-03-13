import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Product } from './product.model';

@Injectable()
export class ProductApiService {
  #http = inject(HttpClient);

  findOne(id: string) {
    return this.#http.get<Product>(`/products/${id}`);
  }

  remove(id: string) {
    return this.#http.delete<void>(`/products/${id}`);
  }
}
