import {
  provideRouter,
  Routes,
  withComponentInputBinding,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
  withRouterConfig, withViewTransitions,
} from '@angular/router';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { inject, provideEnvironmentInitializer } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { apiInterceptor } from './interceptor/api.interceptor';

export interface CoreOptions {
  routes: Routes;
}

export function provideCore({ routes }: CoreOptions) {
  return [
    provideRouter(
      routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload',
        paramsInheritanceStrategy: 'always',
        defaultQueryParamsHandling: 'merge',
      }),
      withComponentInputBinding(),
      withEnabledBlockingInitialNavigation(),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
      withViewTransitions(),
    ),
    provideHttpClient(withFetch(), withInterceptors([apiInterceptor])),

    // other 3rd party libraries providers like NgRx, provideStore()
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },

    // other application specific providers and setup

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
