import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Product } from './product.model';

@Injectable()
export class ProductApiService {
  #http = inject(HttpClient);

  find(query: string) {
    return this.#http.get<Product[]>('/products', {
      params: new HttpParams().set('q', query),
    });
  }

  findOne(id: string) {
    return this.#http.get<Product>(`/products/${id}`);
  }

  create(product: Product) {
    const uuid = self.crypto.randomUUID();
    return this.#http.post('/products', { ...product, id: uuid });
  }

  update(product: Product) {
    return this.#http.put(`/products/${product.id}`, product);
  }

  remove(id: string) {
    return this.#http.delete<void>(`/products/${id}`);
  }
}
