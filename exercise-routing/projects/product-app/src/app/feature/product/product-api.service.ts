import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Product } from './product.model';

@Injectable()
export class ProductApiService {
  #http = inject(HttpClient);

  remove(id: string) {
    return this.#http.delete<void>(`/products/${id}`);
  }
}
