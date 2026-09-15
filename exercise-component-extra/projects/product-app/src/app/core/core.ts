import {
  provideRouter,
  Routes,
  withComponentInputBinding,
  withInMemoryScrolling,
  withRouterConfig,
  withViewTransitions,
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
      withComponentInputBinding(),
      withRouterConfig({
        onSameUrlNavigation: 'reload',
        paramsInheritanceStrategy: 'always',
        defaultQueryParamsHandling: 'merge',
      }),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),

      withViewTransitions(),

      // TODO 16: try navigating in the app, then type a search query. What looks wrong?
      // each query change triggers a page-wide transition, making search look like a reload
      // extend withViewTransitions({ ... }) with this callback to skip same-page updates:
      // onViewTransitionCreated: ({ transition }) => {
      //   const router = inject(Router);
      //   const url = router.currentNavigation()!.finalUrl!;
      //   if (isActive(url, router, { paths: 'exact', queryParams: 'ignored' })()) {
      //     transition.skipTransition();
      //   }
      // },
      // verify: route changes animate; search updates do not
      // docs: https://angular.dev/guide/routing/route-transition-animations#advanced-transition-control-with-onviewtransitioncreated
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
