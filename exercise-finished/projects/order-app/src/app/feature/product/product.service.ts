import { inject, Injectable, signal } from '@angular/core';

import { Product } from './product.model';
import { HttpClient, HttpParams } from '@angular/common/http';

const API_ENDPOINT = '/products';

@Injectable()
export class ProductService {
  private http = inject(HttpClient);

  private _products = signal<{
    loading: boolean;
    products: Product[];
    error: string | null;
  }>({
    loading: false,
    products: [],
    error: null,
  });

  products = this._products.asReadonly();

  loadProducts(query?: string) {
    this._products.update((products) => ({ ...products, loading: true }));

    const options = query ? { params: new HttpParams().set('q', query) } : {};

    this.http.get<Product[]>(API_ENDPOINT, options).subscribe({
      next: (products) => {
        this._products.update((state) => ({
          error: null,
          loading: false,
          products,
        }));
      },
      error: (error) => {
        this._products.set({
          error: error.message,
          loading: false,
          products: [],
        });
      },
    });
  }
}
