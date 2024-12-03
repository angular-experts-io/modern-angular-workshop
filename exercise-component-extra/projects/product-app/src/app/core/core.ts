import {
  provideRouter,
  Routes,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import { inject, provideEnvironmentInitializer } from '@angular/core';
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
      withComponentInputBinding(),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
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
