import {
  provideRouter,
  Routes,
  withComponentInputBinding,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
  withRouterConfig,
} from '@angular/router';
import { inject, provideEnvironmentInitializer } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { apiInterceptor } from './interceptor/api.interceptor';

export interface CoreOptions {
  routes: Routes;
}

export function provideCore(options: CoreOptions) {
  return [

    provideRouter(
      options.routes,
      // TODO 1: adding router features
      // let's add features which (provideX, and then nested optional withY pattern)
      // try starting with the "with" and code completion
      // 1. bind route params to component inputs
      // 2. enable in memory scrolling
      // 3. specify router config:
      //  - reload on same URL navigation
      //  - inherit params always
      //  - merge query params by default (since v18.2, VERY IMPORTANT, why?)
      // 4. add support for injector auto cleanup
      // leave view transitions for optional TODO 21
      // make sure to check what are the available options of each feature
      // (try to search official Angular docs about provideRouter for more info)


      // TODO 21: (optional) enable view transitions
      // add withViewTransitions() to provideRouter() and try navigating between routes
      // then change the search query: as it is reflected in the URL, the page might blink
      // because query param changes also trigger a view transition

      // TODO 22: (optional) skip transitions when only query params or the fragment change
      // extract this helper into core/routing.utils.ts to keep the router setup concise:
      //
      // import { inject } from '@angular/core';
      // import { Router, ViewTransitionInfo } from '@angular/router';
      //
      // export function skipQueryOnlyTransition({ transition }: ViewTransitionInfo) {
      //   const router = inject(Router);
      //   const targetUrl = router.currentNavigation()!.finalUrl!;
      //
      //   if (
      //     router.isActive(targetUrl, {
      //       paths: 'exact',
      //       matrixParams: 'exact',
      //       queryParams: 'ignored',
      //       fragment: 'ignored',
      //     })
      //   ) {
      //     transition.skipTransition();
      //   }
      // }
      //
      // in core.ts, import the helper:
      // import { skipQueryOnlyTransition } from './routing.utils';
      //
      // replace withViewTransitions() with:
      // withViewTransitions({
      //   onViewTransitionCreated: skipQueryOnlyTransition,
      // }),
      //
      // try searching again: reflecting the query in the URL should no longer animate
      // navigation between routes should still animate
    ),

    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
    provideHttpClient(withFetch(), withInterceptors([apiInterceptor])),

    // perform initialization, has to be last
    provideEnvironmentInitializer(() => {
      // add init logic here...
      // kickstart processes, trigger initial requests or actions, ...

      inject(MatIconRegistry).setDefaultFontSetClass(
        'material-symbols-outlined',
      );
    }),
  ];
}
