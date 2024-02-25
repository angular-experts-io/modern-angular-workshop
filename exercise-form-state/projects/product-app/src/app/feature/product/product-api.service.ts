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

  // TODO 8: let's add a create method which will perform a POST request to the API endpoint
  // because of limitation of the exercise backend, we need to generate a random UUID for the new product
  // the method will receive Partial<Product> and return the result of the POST request
  // in the frontend, we can use self.crypto.randomUUID() to generate a random UUID (browser native)
  // create a new product object by spreading the partial product and adding the generated UUID as "id"
  create(product: Partial<Product>) {
    const uuid = self.crypto.randomUUID();
    return this.httpClient.post('/products', { ...product, id: uuid });
  }

  // TODO 9: let's add an update method which will perform a PUT request to the API endpoint
  // the method will receive a Product and return the result of the PUT request
  // the request will be performed to an endpoint with the product "id" as a path parameter
  // we can use JavaScript template literals to concatenate endpoint and product id
  update(product: Product) {
    return this.httpClient.put(`/products/${product.id}`, product);
  }

  remove(id: string) {
    return this.httpClient.delete<void>(`/products/${id}`);
  }
}
