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

export interface CoreOptions {
  routes: Routes;
}

export function provideCore(options: CoreOptions) {
  return [
    provideRouter(
      options.routes,
      withComponentInputBinding(), // binds route :params to component inputs automatically!
      // reasonable defaults...
      withEnabledBlockingInitialNavigation(),
      withRouterConfig({
        onSameUrlNavigation: 'reload',
        paramsInheritanceStrategy: 'always',
      }),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
    ),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
    // TODO 1: HttpClient is provided by default since Angular 21, no setup needed.
    // Earlier versions required provideHttpClient(); we will use it for interceptors in TODO 21.
    // See https://angular.dev/guide/http/setup

    // TODO 21: Interceptors
    // create a new "api" interceptor in the core/interceptor/ folder using Angular Schematics (IDE integration)
    // in the interceptor, import "environment" add use the provided API_URL to prefix the request URL
    // to do that we have to adjust request before we call "next(req)" using the req "clone" method
    // keep in mind that the clone method is immutable and returns a new instance of the request
    // once ready, import "provideHttpClient" and "withInterceptors" from "@angular/common/http"
    // and add provideHttpClient(withInterceptors([apiInterceptor])) to the providers here
    // last step is to adjust hardcoded URL in the previously defined "productResource"
    // and in the "ProductApiService", then check in the running app if everything works as expected

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
