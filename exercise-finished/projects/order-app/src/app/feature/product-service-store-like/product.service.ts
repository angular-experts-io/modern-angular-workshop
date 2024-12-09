import {
  computed,
  effect,
  inject,
  Injectable,
  signal,
  untracked,
} from '@angular/core';
import { debounceTime, switchMap, tap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

import { Product } from './product.model';
import { ProductApiService } from './product-api.service';

@Injectable()
export class ProductService {
  #productApiService = inject(ProductApiService);

  // private state
  #query = signal('');
  #products = signal<Product[]>([]);
  #loading = signal(true);
  #error = signal<string | undefined>(undefined);
  #selectedProductId = signal<string | undefined>(undefined);
  #editorNewProductCreated = signal(false);
  #editorLoading = signal(false);
  #editorError = signal<string | undefined>(undefined);

  // public state
  query = this.#query.asReadonly();
  loading = this.#loading.asReadonly();
  loadingShowSkeleton = computed(
    () => this.productsCount() === 0 && this.#loading(),
  );
  error = this.#error.asReadonly();
  products = this.#products.asReadonly();
  productsCount = computed(() => this.#products().length ?? 0);
  selectedProductId = this.#selectedProductId.asReadonly();
  selectedProduct = computed(() => {
    const product = this.#products().find(
      (p) => p.id === this.#selectedProductId(),
    );
    return product
      ? {
          ...product,
          averagePrice: this.#calculateAveragePrice(product),
        }
      : undefined;
  });
  nextProductId = computed(() => {
    const products = this.#products();
    const index = products.findIndex((p) => p.id === this.#selectedProductId());
    return (products[index + 1] ?? products[0]).id;
  });
  prevProductId = computed(() => {
    const products = this.#products();
    const index = products.findIndex((p) => p.id === this.#selectedProductId());
    return (products[index - 1] ?? products[products.length - 1]).id;
  });
  editorNewProductCreated = this.#editorNewProductCreated.asReadonly();
  editorLoading = this.#editorLoading.asReadonly();
  editorError = this.#editorError.asReadonly();
  editorDisabled = computed(
    () => this.#editorLoading() || this.#editorNewProductCreated(),
  );

  // effects
  #effectLoadDataOnQueryChange = effect(() => {
    const query = this.query();

    // prevent accidental infinity loops
    // if the loadByQuery impl changes in the future
    untracked(() => {
      this.loadByQuery(query); // load data on query change
    });
  });

  // state change methods
  updateQuery(query: string) {
    this.#query.set(query);
  }

  updateError(error: string | undefined) {
    this.#error.set(error);
  }

  updateSelectedProductId(id: string | undefined) {
    this.#selectedProductId.set(id);
  }

  updateEditorNewProductCreated(value: boolean) {
    this.#editorNewProductCreated.set(value);
  }

  // async methods
  // rxMethod streamifies the call and allows us to use one of the flattening operators (concatMap, mergeMap, switchMap, exhaustMap)
  loadByQuery = rxMethod<string>((query) =>
    query.pipe(
      debounceTime(250),
      tap(() => this.#loading.set(true)),
      switchMap((query) =>
        this.#productApiService.find(query).pipe(
          tap({
            next: (products) =>
              this.#products.set(
                products.sort((p1, p2) => p1.name.localeCompare(p2.name)),
              ),
            error: (error: Error) => {
              this.#products.set([]);
              this.#error.set(error?.message ?? error?.toString());
            },
            finalize: () => this.#loading.set(false),
          }),
        ),
      ),
    ),
  );

  // multiple calls are independent and responses may arrive out of order (race condition)
  loadByQueryUnsafe(query: string | null) {
    this.#loading.set(true);
    return this.#productApiService
      .find(query)
      .pipe(
        tap({
          next: (products) =>
            this.#products.set(
              products.sort((p1, p2) => p1.name.localeCompare(p2.name)),
            ),
          error: (error: Error) => {
            this.#products.set([]);
            this.#error.set(error?.message ?? error?.toString());
          },
          finalize: () => this.#loading.set(false),
        }),
      )
      .subscribe();
  }

  // standard fn call based implementation
  // could be called multiple times which is not good (racing condition, multiple requests)
  // this potential problems are prevented by the UI which disables the button
  // the only way to solve it robustly is to streamify the call (eg rxMethod)
  // which allows for use of one of the flattening operators (concatMap, mergeMap, switchMap, exhaustMap)
  create(product: Partial<Product>) {
    this.#editorLoading.set(true);
    return this.#productApiService
      .create(product)
      .pipe(
        tap({
          next: () => {
            this.#editorNewProductCreated.set(true);
            this.loadByQuery(this.#query());
          },
          error: (error: Error) => {
            this.#editorError.set(error?.message ?? error?.toString());
          },
          finalize: () => this.#editorLoading.set(false),
        }),
      )
      .subscribe();
  }

  update(product: Product) {
    this.#editorLoading.set(true);
    return this.#productApiService
      .update(product)
      .pipe(
        tap({
          next: () => this.loadByQuery(this.#query()),
          error: (error: Error) => {
            this.#editorError.set(error?.message ?? error?.toString());
          },
          finalize: () => this.#editorLoading.set(false),
        }),
      )
      .subscribe();
  }

  removeOptimistic(id: string) {
    // no loading because we just remove project synchronously (optimistic)
    const originalProducts = this.#products();
    const products = this.#products().filter((p) => p.id !== id);
    this.#products.set(products);
    return this.#productApiService
      .remove(id)
      .pipe(
        tap({
          next: () => {},
          error: (error: Error) => {
            this.#products.set(originalProducts);
            this.#error.set(
              `Removal of the product "${originalProducts.find((p) => p.id === id)?.name}" failed, the product was re-added to the list, details "${error?.message ?? error?.toString()}"`,
            );
          },
        }),
      )
      .subscribe();
  }

  #calculateAveragePrice(product: Product) {
    return (
      product.pricePerMonth.reduce((a, b) => a + b, 0) /
      product.pricePerMonth.length
    ).toFixed(2);
  }
}
