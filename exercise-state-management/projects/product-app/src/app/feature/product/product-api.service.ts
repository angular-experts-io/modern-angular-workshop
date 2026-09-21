import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { Product, ProductUpsert } from './product.model';

@Service({ autoProvided: false })
export class ProductApiService {
  #http = inject(HttpClient);

  findOne(id: string) {
    return this.#http.get<Product>(`/products/${id}`);
  }

  create(product: ProductUpsert) {
    const uuid = self.crypto.randomUUID();
    return firstValueFrom(this.#http.post('/products', { ...product, id: uuid }));
  }

  update(product: Product) {
    return firstValueFrom(this.#http.put(`/products/${product.id}`, product));
  }

  remove(id: string) {
    return firstValueFrom(this.#http.delete<void>(`/products/${id}`));
  }
}
