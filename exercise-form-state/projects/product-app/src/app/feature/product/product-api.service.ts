import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Product } from './product.model';

@Injectable()
export class ProductApiService {
  #http = inject(HttpClient);

  find(query: string) {
    return this.#http.get<Product[]>('/products', {
      params: new HttpParams().set('q', query),
    });
  }

  findOne(id: string) {
    return this.#http.get<Product>(`/products/${id}`);
  }

  // TODO 19: let's add a create method which will perform a POST request to the API endpoint
  // the method will receive Partial<Product> and return the result of the POST request
  // because of limitation of the exercise backend, we need to generate a random UUID for the new product
  // in the frontend, we can use self.crypto.randomUUID() to generate a random UUID (browser native)
  // create a new product object by spreading the partial product and adding the generated UUID as "id" property
  // lastly, we wrap the POST request with firstValueFrom to convert the Observable to a Promise

  // TODO 20: let's add an update method which will perform a PUT request to the API endpoint
  // the method will receive a Product and return the result of the PUT request
  // the request will be performed to an endpoint with the product "id" as a path parameter
  // we can use JavaScript template literals to concatenate endpoint and product id
  // lastly, we wrap the PUT request with firstValueFrom to convert the Observable to a Promise

  remove(id: string) {
    return this.#http.delete<void>(`/products/${id}`);
  }
}
