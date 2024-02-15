import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { concatMap, throwError, timer } from 'rxjs';

import { Product } from './product.model';

const API_ENDPOINT = '/products';

@Injectable()
export class ProductService {
  private http = inject(HttpClient);

  find(query: string | null) {
    const options = query ? { params: new HttpParams().set('q', query) } : {};
    return this.http.get<Product[]>(API_ENDPOINT, options);
  }

  create(product: Partial<Product>) {
    const uuid = self.crypto.randomUUID();
    return this.http.post(API_ENDPOINT, { ...product, id: uuid });
  }

  update(product: Product) {
    return this.http.put(`${API_ENDPOINT}/${product.id}`, product);
  }

  remove(productId: string) {
    return Math.random() > 0.5
      ? // Simulate a delay and then throw an error with a 50% chance
        timer(1000).pipe(
          concatMap(() =>
            throwError(
              () => new Error(`Removing of the product "${productId}" failed`),
            ),
          ),
        )
      : this.http.delete(`${API_ENDPOINT}/${productId}`);
  }
}
