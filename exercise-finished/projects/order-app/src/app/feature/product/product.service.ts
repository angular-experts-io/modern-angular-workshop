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
    error: string | undefined;
  }>({
    loading: false,
    products: [],
    error: undefined,
  });

  products = this._products.asReadonly();

  loadProducts(query?: string | null) {
    this._products.update((products) => ({ ...products, loading: true }));

    const options = query ? { params: new HttpParams().set('q', query) } : {};

    this.http.get<Product[]>(API_ENDPOINT, options).subscribe({
      next: (products) => {
        this._products.set({
          error: undefined,
          loading: false,
          products,
        });
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

  removeProduct(id: string) {
    this._products.update((products) => ({ ...products, loading: true }));
    this.http.delete(`${API_ENDPOINT}/${id}`).subscribe({
      next: (r) => {
        console.log(r);
        this._products.set({
          error: undefined,
          loading: false,
          products: this.products().products.filter((p) => p.id !== id),
        });
      },
      error: (error) => {
        this._products.update((products) => ({
          ...products,
          loading: false,
          error: error.message,
        }));
      },
    });
  }
}
