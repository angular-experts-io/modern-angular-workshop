import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Product } from './product.model';

@Injectable()
export class ProductApiService {
  private httpClient = inject(HttpClient);

  find(query: string) {
    return this.httpClient.get<Product[]>('/products', {
      params: new HttpParams().set('q', query),
    });
  }

  findOne(id: string) {
    return this.httpClient.get<Product>(`/products/${id}`);
  }

  create(product: Product) {
    const uuid = self.crypto.randomUUID();
    return this.httpClient.post('/products', { ...product, id: uuid });
  }

  update(product: Product) {
    return this.httpClient.put(`/products/${product.id}`, product);
  }

  remove(id: string) {
    return this.httpClient.delete<void>(`/products/${id}`);
  }
}
