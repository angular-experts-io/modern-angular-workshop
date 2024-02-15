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
import { concatMap, debounceTime, pipe, switchMap, tap } from 'rxjs';

import { Product } from './product.model';
import { ProductService } from './product.service';

type ProductState = {
  products: Product[];
  loading: boolean;
  error: string | undefined;
  query: string;
};

const initialState: ProductState = {
  products: [],
  loading: false,
  error: undefined,
  query: '',
};

export const ProductStore = signalStore(
  withState(initialState),
  withComputed(({ products }) => ({
    productsCount: computed(() => products().length ?? 0),
  })),
  withMethods((store, productService = inject(ProductService)) => ({
    updateQuery(query: string): void {
      patchState(store, (state) => ({ ...state, query }));
    },
    removeError(): void {
      patchState(store, (state) => ({ ...state, error: undefined }));
    },
    loadByQuery: rxMethod<string>((id) =>
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
    ),
    remove: rxMethod<string>((id) =>
      id.pipe(
        tap(() => patchState(store, { loading: true })),
        concatMap((productId) =>
          productService.remove(productId).pipe(
            tapResponse({
              next: () => {
                const products = store
                  .products()
                  .filter((p) => p.id !== productId);
                patchState(store, { products });
              },
              error: (error: Error) =>
                patchState(store, {
                  error: error?.message ?? error?.toString(),
                }),
              finalize: () => patchState(store, { loading: false }),
            }),
          ),
        ),
      ),
    ),
    removeOptimistic: rxMethod<string>((id) => {
      const originalProducts = store.products();
      return id.pipe(
        tap((productId) => {
          const products = store.products().filter((p) => p.id !== productId);
          patchState(store, { products });
        }),
        concatMap((productId) =>
          productService.remove(productId).pipe(
            tap({
              error: (error: Error) => {
                patchState(store, {
                  products: originalProducts,
                  error: error?.message ?? error?.toString(),
                });
              },
            }),
          ),
        ),
      );
    }),
  })),
  withHooks({
    onInit(store) {
      effect(() => {
        store.loadByQuery(store.query());
      });
    },
  }),
);
