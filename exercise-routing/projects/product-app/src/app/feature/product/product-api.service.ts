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

  findById(productId: string) {
    return this.httpClient.get<Product>(`/products/${productId}`);
  }

  remove(id: string) {
    return this.httpClient.delete<void>(`/products/${id}`);
  }
}
