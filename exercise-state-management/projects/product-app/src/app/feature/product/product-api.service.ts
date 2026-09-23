import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { Product } from './product.model';

@Service({ autoProvided: false })
export class ProductApiService {
  #http = inject(HttpClient);

  findOne(id: string) {
    return this.#http.get<Product>(`/products/${id}`);
  }
  create(product: Partial<Product>) {
    return firstValueFrom(
      this.#http.post<Product>('/products', { ...product, id: self.crypto.randomUUID() }),
    );
  }
  update(product: Product) {
    return firstValueFrom(this.#http.put<Product>(`/products/${product.id}`, product));
  }

  remove(id: string) {
    return firstValueFrom(this.#http.delete<void>(`/products/${id}`));
  }
}
