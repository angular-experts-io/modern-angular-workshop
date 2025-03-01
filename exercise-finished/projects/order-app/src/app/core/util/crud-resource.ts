import { inject, DestroyRef, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed, rxResource } from '@angular/core/rxjs-interop';
import {
  Subject,
  concatMap,
  tap,
  Observable,
  pipe,
  OperatorFunction,
  mergeMap,
  switchMap,
  exhaustMap,
  catchError,
  EMPTY,
  map,
} from 'rxjs';

export function crudResource<T, ID>(
  url: string,
  options?: CrudResourceOptions<T, ID>,
) {
  const http = inject(HttpClient);

  const strategy = options?.strategy ?? 'pessimistic';

  const loadingCreate = signal(false);
  const loadingUpdate = signal(false);
  const loadingRemove = signal(false);
  const errorCreate = signal('');
  const errorUpdate = signal('');
  const errorRemove = signal('');

  const resource = rxResource({
    request: () => '' as ID,
    loader: () => {
      return http.get<T[]>(url);
    },
  });

  const create = streamify<[T]>((stream) =>
    stream.pipe(
      tap(([item]) => {
        loadingCreate.set(true);
        if (strategy === 'optimistic') {
          resource.update((prev) => [...(prev ?? []), item]);
        }
      }),
      behaviorToOperator(options?.create?.behavior)(([item]) =>
        http.post(url, item).pipe(
          catchError((err) => {
            errorCreate.set(err);
            if (strategy === 'optimistic') {
              resource.update((prev) =>
                prev?.filter((prevItem) => prevItem !== item),
              );
            }
            return [undefined];
          }),
        ),
      ),
      tap(() => {
        if (options?.strategy === 'pessimistic') {
          resource.reload();
        }
        loadingCreate.set(false);
      }),
    ),
  );

  const update = streamify<[ID, T]>((stream) =>
    stream.pipe(
      tap(([id, item]) => {
        loadingUpdate.set(true);
        if (strategy === 'optimistic') {
          resource.update((prev) =>
            prev?.map((prevItem) => {
              const prevItemId =
                options?.idSelector?.(prevItem) ??
                (prevItem as unknown as { id: string }).id;
              return prevItemId === id ? { ...prevItem, ...item } : prevItem;
            }),
          );
        }
      }),
      behaviorToOperator(options?.update?.behavior)(([id, item]) =>
        http.put(`${url}/${id}`, item).pipe(
          catchError((err) => {
            errorUpdate.set(err);
            if (strategy === 'optimistic') {
              resource.update((prev) =>
                prev?.map((prevItem) => {
                  const prevItemId =
                    options?.idSelector?.(prevItem) ??
                    (prevItem as unknown as { id: string }).id;
                  return prevItemId === id ? item : prevItem;
                }),
              );
            }
            return [undefined];
          }),
        ),
      ),
      tap(() => {
        if (options?.strategy === 'pessimistic') {
          resource.reload();
        }
        loadingUpdate.set(false);
      }),
    ),
  );

  const remove = streamify<[ID]>((stream) =>
    stream.pipe(
      tap(() => loadingRemove.set(true)),
      map(([id]) => {
        const removedItem = resource.value()?.find((item) => {
          if (options?.idSelector) {
            return options.idSelector(item) === id;
          } else {
            return (item as unknown as { id: ID }).id === id;
          }
        });
        if (options?.strategy === 'optimistic' && removedItem) {
          resource.update((prev) =>
            prev?.filter((prevItem) => prevItem !== removedItem),
          );
        }
        return { id, removedItem };
      }),
      behaviorToOperator(options?.remove?.behavior)(({ id, removedItem }) =>
        http.delete(`${url}/${id}`).pipe(
          catchError((err) => {
            errorUpdate.set(err);
            if (strategy === 'optimistic' && removedItem) {
              resource.update((prev) => [...(prev ?? []), removedItem]);
            }
            return [undefined];
          }),
        ),
      ),
      tap(() => {
        if (options?.strategy === 'pessimistic') {
          resource.reload();
        }
        loadingRemove.set(false);
      }),
    ),
  );

  const loading = computed(
    () =>
      !loadingInitial() &&
      (resource.isLoading() ||
        loadingCreate() ||
        loadingUpdate() ||
        loadingRemove()),
  );
  const loadingInitial = computed(
    () => !resource.value() && resource.isLoading(),
  );

  return {
    loadingInitial,
    loading,
    loadingCreate,
    loadingUpdate,
    loadingRemove,
    errorCreate,
    errorUpdate,
    errorRemove,
    value: resource.value,
    create,
    update,
    remove,
  };
}

function behaviorToOperator(behavior: Behavior = 'concat') {
  switch (behavior) {
    case 'concat':
      return concatMap;
    case 'merge':
      return mergeMap;
    case 'switch':
      return switchMap;
    case 'exhaust':
      return exhaustMap;
  }
}

function streamify<T extends unknown[]>(
  impl: (stream: Observable<T>) => Observable<unknown>,
) {
  const destroyRef = inject(DestroyRef);
  const subject = new Subject<T>();
  impl(subject).pipe(takeUntilDestroyed(destroyRef)).subscribe();
  return (...args: T) => subject.next(args);
}

export type Behavior = 'concat' | 'merge' | 'switch' | 'exhaust';
export type Strategy = 'optimistic' | 'pessimistic';
export interface CrudResourceOptions<T, ID> {
  idSelector?: (item: T) => ID;
  strategy?: Strategy;
  create?: {
    behavior: Behavior;
  };
  update?: {
    behavior: Behavior;
  };
  remove?: {
    behavior: Behavior;
  };
}
