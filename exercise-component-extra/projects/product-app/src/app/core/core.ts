import {
  provideRouter,
  Routes,
  withComponentInputBinding,
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
    // TODO 19 (Optional): enable zone-less change detection, what provider do we need?
    // how can we get rid of zone.js completely? (what provider do we need, where do we need to remove zone.js?)
    // once done, try to verify in running app by writing "zone" in the Dev Tools console
    // does application still work? what about all the calls to NgZone.runOutsideAngular()?
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

      // TODO 16: add "withViewTransitions()" router feature and see it in action in the running app
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
