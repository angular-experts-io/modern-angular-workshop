import {
  provideRouter,
  Routes,
  withComponentInputBinding,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
  withRouterConfig,
} from '@angular/router';
import { ENVIRONMENT_INITIALIZER, inject } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
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
    provideAnimationsAsync(),

    provideRouter(
      options.routes,
      // TODO 1: adding router features
      // let's add features which bind route params to component inputs
      // and enable in memory scrolling
      // make sure to check what are the available options of each feature
      // (try to search official google docs about provideRouter for more info)
    ),

    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
    provideHttpClient(withFetch(), withInterceptors([apiInterceptor])),

    // perform initialization, has to be last
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue() {
        // add init logic here...
        // kickstart processes, trigger initial requests or actions, ...

        inject(MatIconRegistry).setDefaultFontSetClass(
          'material-symbols-outlined',
        );
      },
    },
  ];
}
