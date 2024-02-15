import { Router } from '@angular/router';
import { computed, effect, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { tapResponse } from '@ngrx/operators';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { concatMap, debounceTime, switchMap, tap } from 'rxjs';

import { Product } from './product.model';
import { ProductService } from './product.service';

type ProductState = {
  selectedProductId: string | undefined;
  products: Product[];
  loading: boolean;
  error: string | undefined;
  query: string;
};

const initialState: ProductState = {
  selectedProductId: undefined,
  products: [],
  loading: true,
  error: undefined,
  query: '',
};

export const ProductStore = signalStore(
  withState(initialState),
  withComputed(({ products, selectedProductId }) => ({
    productsCount: computed(() => products().length ?? 0),
    selectedProduct: computed(() => {
      const product = products().find((p) => p.id === selectedProductId());
      if (product) {
        return {
          ...product,
          averagePrice: (
            product.pricePerMonth.reduce((a, b) => a + b, 0) /
            product.pricePerMonth.length
          ).toFixed(2),
        };
      } else {
        return undefined;
      }
    }),
    nextProductId: computed(() => {
      const index = products().findIndex((p) => p.id === selectedProductId());
      return (products()[index + 1] ?? products()[0]).id;
    }),
    prevProductId: computed(() => {
      const index = products().findIndex((p) => p.id === selectedProductId());
      return (products()[index - 1] ?? products()[products().length - 1]).id;
    }),
  })),
  withMethods(
    (
      store,
      productService = inject(ProductService),
      router = inject(Router),
    ) => {
      const loadByQuery = rxMethod<string>((id) =>
        id.pipe(
          debounceTime(250),
          tap(() => patchState(store, { loading: true })),
          switchMap((query) =>
            productService.find(query).pipe(
              tapResponse({
                next: (products) => patchState(store, { products }),
                error: (error: Error) =>
                  patchState(store, {
                    products: [],
                    error: error?.message ?? error?.toString(),
                  }),
                finalize: () => patchState(store, { loading: false }),
              }),
            ),
          ),
        ),
      );
      const update = rxMethod<Product>((product) =>
        product.pipe(
          tap(() => patchState(store, { loading: true })),
          concatMap((product) =>
            productService.update(product).pipe(
              tapResponse({
                next: () => {},
                error: (error: Error) =>
                  patchState(store, {
                    error: error?.message ?? error?.toString(),
                  }),
              }),
            ),
          ),
        ),
      );
      const remove = rxMethod<string>((id) =>
        id.pipe(
          tap(() => patchState(store, { loading: true })),
          concatMap((productId) =>
            productService.remove(productId).pipe(
              tapResponse({
                next: () => loadByQuery(store.query()),
                error: (error: Error) =>
                  patchState(store, {
                    loading: false,
                    error: error?.message ?? error?.toString(),
                  }),
              }),
            ),
          ),
        ),
      );
      const removeOptimistic = rxMethod<string>((id) => {
        return id.pipe(
          concatMap((productId) => {
            const originalProducts = store.products();
            const products = store.products().filter((p) => p.id !== productId);
            patchState(store, { products });
            return productService.remove(productId).pipe(
              tapResponse({
                next: () => {},
                error: (error: Error) => {
                  patchState(store, {
                    products: originalProducts,
                    error: error?.message ?? error?.toString(),
                  });
                },
              }),
            );
          }),
        );
      });

      return {
        selectProduct(productId: string | undefined): void {
          patchState(store, { selectedProductId: productId });
        },
        updateQuery(query: string): void {
          patchState(store, (state) => ({ ...state, query }));
        },
        removeError(): void {
          patchState(store, (state) => ({ ...state, error: undefined }));
        },
        loadByQuery,
        update,
        remove,
        removeOptimistic,
      };
    },
  ),
  withHooks({
    onInit(store) {
      effect(() => {
        store.loadByQuery(store.query());
      });
    },
  }),
);
