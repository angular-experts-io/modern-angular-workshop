import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Product } from './product.model';

const API_ENDPOINT = '/products';

@Injectable()
export class ProductService {
  private http = inject(HttpClient);

  find(query: string | null) {
    const options = query ? { params: new HttpParams().set('q', query) } : {};
    return this.http.get<Product[]>(API_ENDPOINT, options);
  }

  findOne(productId: string) {
    return this.http.get<Product>(`${API_ENDPOINT}/${productId}`);
  }

  remove(productId: string) {
    return this.http.delete(`${API_ENDPOINT}/${productId}`);
  }
}
