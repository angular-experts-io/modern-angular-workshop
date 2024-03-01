import { computed, effect, inject, untracked } from '@angular/core';
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
  query: string;
  products: Product[];
  loading: boolean;
  error: string | undefined;
  selectedProductId: string | undefined;
  editorNewProductCreated: boolean;
  editorLoading: boolean;
  editorError: string | undefined;
};

const initialState: ProductState = {
  query: '',
  products: [],
  loading: true,
  error: undefined,
  selectedProductId: undefined,
  editorNewProductCreated: false,
  editorLoading: false,
  editorError: undefined,
};

export const ProductStore = signalStore(
  withState(initialState),
  withComputed(
    ({
      loading,
      products,
      selectedProductId,
      editorLoading,
      editorNewProductCreated,
    }) => ({
      productsCount: computed(() => products().length ?? 0),
      loadingShowSkeleton: computed(() => products().length === 0 && loading()),
      editorDisabled: computed(
        () => editorLoading() || editorNewProductCreated(),
      ),
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
    }),
  ),
  withMethods((store, productService = inject(ProductService)) => {
    const loadByQuery = rxMethod<string>((id) =>
      id.pipe(
        debounceTime(250),
        tap(() => patchState(store, { loading: true })),
        switchMap((query) =>
          productService.find(query).pipe(
            tapResponse({
              next: (products) =>
                patchState(store, {
                  products: products.sort((p1, p2) =>
                    p1.name.localeCompare(p2.name),
                  ),
                }),
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
    const create = rxMethod<Product>((product) =>
      product.pipe(
        tap(() => patchState(store, { editorLoading: true })),
        concatMap((product) =>
          productService.create(product).pipe(
            tapResponse({
              next: () => {
                patchState(store, {
                  editorNewProductCreated: true,
                });
                loadByQuery(store.query());
              },
              error: (error: Error) =>
                patchState(store, {
                  editorError: error?.message ?? error?.toString(),
                }),
              finalize: () => patchState(store, { editorLoading: false }),
            }),
          ),
        ),
      ),
    );
    const update = rxMethod<Product>((product) =>
      product.pipe(
        tap(() => patchState(store, { editorLoading: true })),
        concatMap((product) =>
          productService.update(product).pipe(
            tapResponse({
              next: () => loadByQuery(store.query()),
              error: (error: Error) =>
                patchState(store, {
                  editorError: error?.message ?? error?.toString(),
                }),
              finalize: () => patchState(store, { editorLoading: false }),
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
                  error: `Removal of the product with id: "${id}" failed, the product was re-added to the list, details "${error?.message ?? error?.toString()}"`,
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
                  error: `Removal of the product "${originalProducts.find((p) => p.id === productId)?.name}" failed, the product was re-added to the list, details ${error?.message ?? error?.toString()}`,
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
      unsetEditorNewProductCreated(): void {
        patchState(store, { editorNewProductCreated: false });
      },
      updateQuery(query: string): void {
        patchState(store, (state) => ({ ...state, query }));
      },
      removeError(): void {
        patchState(store, (state) => ({ ...state, error: undefined }));
      },
      loadByQuery,
      create,
      update,
      remove,
      removeOptimistic,
    };
  }),
  withHooks({
    onInit(store) {
      effect(() => {
        const query = store.query();
        // prevent accidental infinity loops
        // if the loadByQuery impl changes in the future
        untracked(() => {
          store.loadByQuery(query); // load data on query change
        });
      });
    },
  }),
);
