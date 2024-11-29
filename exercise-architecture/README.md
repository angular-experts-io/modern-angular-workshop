<img height="60" src="https://angularexperts.io/assets/images/logo/angular-experts.svg">

# Modern Angular Workshop

by [@tomastrajan](https://twitter.com/tomastrajan) from [AngularExperts.io](https://angularexperts.io)

# Welcome to exercise - Architecture

In this exercise, we're going to explore how to scaffold an application architecture and automatic architecture validation. We are going to learn the following topics:

- How to prepare folder structure to reflect architectural building blocks
- How to define automated architecture validation
- How to create **standalone** `core` with `provideCore() {}`
- How to create a main layout
- How to create **route** based lazy features

Before we get started, it can be a good idea to adjust Eslint IDE settings, especially the `Working directories` to match the current exercise to prevent false positive errors and warnings.

## TODO 1 - Prepare folder structure

1. In the `projects/product-app/src/app/` we're going to create following folders
   - `core`
   - `layout`
   - `ui`
   - `pattern`
   - `feature`

## TODO 2 - Automated architecture validation

1. Let's install `npm i -D eslint-plugin-boundaries eslint-import-resolver-typescript`
2. In the root `.eslintrc.json` file, we should add the following into the `.ts` overrides...
   - `"plugins": ["boundaries"],`
   - `"plugin:boundaries/strict"` as the last item of `"extends": []` array
   - new `"settings"` property ( after `"rules"` property ) with the following content

```json5
{
  "import/resolver": {
     "typescript": {
        "alwaysTryTypes": true
     }
   },
   "boundaries/ignore": ["**/jest*.{js,ts}"],
   "boundaries/dependency-nodes": ["import", "dynamic-import"],
   "boundaries/elements": [
    /* we're going to provide definitions in the next step, then remove this comment */
   ]
}
```

3. With this setup in place, let's provide definitions for the ` "boundaries/elements": []` array

```json5
  {
    "type": "env",
    "pattern": "environments",
    "basePattern": "projects/**/src",
    "baseCapture": ["app"]
  },
  {
    "type": "main",
    "mode": "file",
    "pattern": "main.ts",
    "basePattern": "projects/**/src",
    "baseCapture": ["app"]
  },
  {
    "type": "app",
    "mode": "file",
    "pattern": "app(-|.)*.ts",
    "basePattern": "projects/**/src/app",
    "baseCapture": ["app"]
  },
  {
    "type": "core",
    "pattern": "core",
    "basePattern": "projects/**/src/app",
    "baseCapture": ["app"]
  },
  {
    "type": "ui",
    "pattern": "ui",
    "basePattern": "projects/**/src/app",
    "baseCapture": ["app"]
  },
  {
    "type": "layout",
    "pattern": "layout",
    "basePattern": "projects/**/src/app",
    "baseCapture": ["app"]
  },
  {
    "type": "pattern",
    "pattern": "pattern",
    "capture": ["pattern"],
    "basePattern": "projects/**/src/app",
    "baseCapture": ["app"]
  },
  {
    "type": "feature-routes",
    "mode": "file",
    "pattern": "feature/*/*.routes.ts",
    "capture": ["feature"],
    "basePattern": "projects/**/src/app",
    "baseCapture": ["app"]
  },
  {
    "type": "feature",
    "pattern": "feature/*",
    "capture": ["feature"],
    "basePattern": "projects/**/src/app",
    "baseCapture": ["app"]
  },

  {
    "type": "lib-api",
    "mode": "file",
    "pattern": "projects/**/src/public-api.ts",
    "capture": ["lib"]
  },
  {
    "type": "lib",
    "pattern": "projects/**/src/lib",
    "capture": ["lib"]
  }
```

4. With this setup in place, let's validate if everything works as expected by running `ng lint`, the output should be that there are no lint errors!
5. With the definitions in place, now it's time to use them to define rules between individual architectural building block types, to do that, we're going to add `"boundaries/element-types": []` array in the `"rules"` property of the `.ts` overrides with the following content

```json5
  
 "error",
 {
   "default": "disallow",
   "rules": [
     {
       "from": "main",
       "allow": [["app", { "app": "${from.app}" }]]
     },
     {
       "from": "core",
       "allow": [
         ["lib-api"],
         ["env", { "app": "${from.app}" }],
         ["core", { "app": "${from.app}" }]
       ]
     },
     {
       "from": "ui",
       "allow": [
         ["lib-api"],
         ["env", { "app": "${from.app}" }],
         ["ui", { "app": "${from.app}" }]
       ]
     },
     {
       "from": "layout",
       "allow": [
         ["lib-api"],
         ["env", { "app": "${from.app}" }],
         ["core", { "app": "${from.app}" }],
         ["ui", { "app": "${from.app}" }],
         ["pattern", { "app": "${from.app}" }]
       ]
     },
     {
       "from": "app",
       "allow": [
         ["lib-api"],
         ["env", { "app": "${from.app}" }],
         ["app", { "app": "${from.app}" }],
         ["core", { "app": "${from.app}" }],
         ["layout", { "app": "${from.app}" }],
         ["feature-routes", { "app": "${from.app}" }]
       ]
     },
     {
       "from": ["pattern"],
       "allow": [
         ["lib-api"],
         ["env", { "app": "${from.app}" }],
         ["core", { "app": "${from.app}" }],
         ["ui", { "app": "${from.app}" }],
         ["pattern", { "app": "${from.app}" }]
       ]
     },
     {
       "from": ["feature"],
       "allow": [
          ["lib-api"],
          ["env", { "app": "${from.app}" }],
          ["core", { "app": "${from.app}" }],
          ["ui", { "app": "${from.app}" }],
          ["pattern", { "app": "${from.app}" }]
       ]
     },
     {
       "from": ["feature-routes"],
       "allow": [
          ["lib-api"],
          ["env", { "app": "${from.app}" }],
          ["core", { "app": "${from.app}" }],
          ["pattern", { "app": "${from.app}" }],
          [
             "feature",
             { "app": "${from.app}", "feature": "${from.feature}" }
          ],
          [
             "feature-routes",
             { "app": "${from.app}", "feature": "!${from.feature}" }
          ]
       ]
    },

     {
       "from": ["lib-api"],
       "allow": [["lib", { "app": "${from.lib}" }]]
     },
     {
       "from": ["lib"],
       "allow": [["lib", { "app": "${from.lib}" }]]
     }
   ]
 }
  
```

6. Once again, let's validate if everything works as expected by running `ng lint`, the output should be that there are no lint errors!

## TODO 3 - Create standalone `core` with `provideCore() {}`

1. In the `projects/product-app/src/app/core/` we're going to create a new `core.ts` file
2. In the `core.ts` file we're going to define a new `provideCore()` function that will provide global infrastructure and services to be used by the rest of the application

```typescript
export function provideCore(): (Provider | EnvironmentProviders)[] {
     return [];
}
```

3. In general, we want to move whole setup into the `core` away from the `app.*` and therefore we're going to introduce `CoreOptions` interface that will allow us to pass additional configuration to the `provideCore()` function

```typescript
export interface CoreOptions {
  routes: Routes;
}

export function provideCore(options: CoreOptions): (Provider | EnvironmentProviders)[] {
  return [];
}
```

4. Now, it's time to import and use the `provideCore()` function in the `app.config.ts` file and pass in `routes` in an options object

```typescript
export const appConfig: ApplicationConfig = {
  providers: [provideCore({ routes })],
  // notice that we have removed provideRouter(routes), provideAnimationsAsync()
  // and we should also clean up the imports
};
```

5. Let's move the `provideRouter(routes)` and `provideAnimationsAsync()` into the `provideCore()` function and remove them from the `app.config.ts` file

```typescript
export function provideCore(options: CoreOptions): (Provider | EnvironmentProviders)[] {
  return [provideAnimationsAsync(), provideRouter(options.routes)];
}
```

6. Let's verify that everything works as expected by running `npm start`...
7. Now, we're going to extend the setup by providing additional router features (after the `options.routes`) with the following

```typescript
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
```

8. Let's add also support for performing backend requests with `provideHttpClient()`...
9. As we are using Angular Material, we're going to provide also some global setup for this library, first we're going to pre-configure appearance of all form fields, this can be achieved by specifying following provider...

```typescript
{
   provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
   useValue: { appearance: 'outline' },
},
```

10. Last part of the core setup is to provide `ENVIRONENT_INITIALIZER` multi token which is the place where we provide setup which requires injection of some service and kickstart global processes as well...

```typescript
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
```

Once done, please refactor it to the new Angular 19 streamlined approach with 
`provideEnvironmentInitializer()` helper. The reason we are exploring both approaches 
is that we're likely to encounter both in the real world codebases.

## TODO 4 - Create the main layout

With the core in place, let's create a main layout for our application.

1. In the `projects/product-app/src/app/layout/` we're going to create a new `main-layout` component with the help of Angular Schematics, try to use IDE integration instead of CLI
2. With the component in place, let's add it to the template of the `app.component.ts` (inline template), the IDE should auto import the `MainLayoutComponent` and add it to the `imports: []` array of the `AppComponent` (else make sure to do it manually), also because we're NOT projecting any content into `<my-org-main-layout>` we can use Angular "self-closing" tag syntax `<my-org-main-layout />` which is shorter!
3. Let's see it running by running `npm start` (we might need to restart our serve process to make sure build found all the new files)...
4. Continue with by adding following template to the `main-layout.component.html` file

```html
<mat-toolbar class="fixed shadow-lg !bg-white z-40">
  <div class="container mx-auto px-10">
    <div class="flex justify-between">
      <a href="https://angularexperts.io" target="_blank">
        <img height="60" width="168" src="https://angularexperts.io/assets/images/logo/angular-experts.svg" alt="Angular Experts Logo" />
      </a>

      <div class="flex items-center gap-4">
        <!-- we're going to add navigation here soon -->
      </div>
    </div>
  </div>
</mat-toolbar>

<main class="container mx-auto mt-16 p-10">
  <router-outlet />
</main>

<footer class="mt-auto p-10 bg-white">
  <div class="container mx-auto text-center">Made with ❤️ by &lt;your-name></div>
</footer>
```

5. With the markup in place, we have to make sure that **all components and directives** that are used in the template have to be imported and added to the `imports: []` array of the `MainLayoutModule`, IDE should be helpful and provide it as an option when selecting components and directives in the template, else do it manually...
6. Let's add some styles to the `main-layout.component.scss` file to make it look better, the styles use Tailwind CSS `@apply` directive to apply utility classes as part of the scss instead of directly in the template, the reason is we're styling the host element, the `my-org-main-layout` element itself, therefore we're using `:host` selector to apply the styles

```scss
:host {
  @apply flex flex-col min-h-screen bg-gray-100;
}
```

## TODO 5 - Create **route** based lazy features

Currently, there is no Angular Schematic to generate whole route based lazy feature, so we're going to create it manually, but in the future this might change, so make sure to check the latest Angular CLI documentation

1. Create a new `home` folder in the `feature/` folder
2. In the `home` folder, create a new `home` component with the help of Angular Schematics (IDE integration)
3. In the `home` folder, create a new `home.routes.ts` file with the following content

```typescript
import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';

export default <Routes>[
  {
    path: '',
    providers: [
      // environment injector (lazy injector) 
      // lazy feature scoped providers go here...
      // previously, this was the responsibility of the lazy NgModule
    ],
    children: [
       {
         path: '',
         component: HomeComponent,
       }
    ],
  },
];
```
4. In the `app.routes.ts`, let's add our first lazy feature route to the `routes` array

```typescript
{
    path: 'home',
    loadChildren: () => import('./feature/home/home.routes')
}
```
5. Let's verify that everything works as expected by running `npm start` and navigating to the `http://localhost:4200/home` URL in the browser (try to restart `serve` or perform a hard browser refresh if it doesn't work)
6. **Now repeat the whole process for the `product` feature**
7. Back in the `main-layout.component.html` file, let's add navigation to the `home` and `product` features using the `a` element, `routerLink` and `mat-flat-button` directives (make sure they are part of the template context), the link should point to a `/<route-name>` string
8. The running app should display two nav buttons, one for the `home` and one for the `product` feature, clicking on them should navigate to the respective feature

## TODO 6 - Architecture validation

Let's see how the architecture validation works in practice!

1. Let's run `ng cache clean` to prevent any potential inconsistent state
2. Run `ng lint` to validate the architecture, the output should be that there are no lint errors!
3. Try to use `<my-org-home />` in the template of the `main-layout.component.html` file and make sure it was imported and added to the `imports: []` array of the `MainLayoutModule`
4. Run `ng lint` again, the output should be that there are lint errors!
5. Open the `main-layout.component.ts` file and the `import { HomeComponent } from '../../feature/home/home/home.component';` should be **underlined with red as a linting error** directly in the editor
6. (Troubleshooting) If that's not the case, try to adjust `Eslint` settings in your IDE by selecting using **Manual configuration** and using the `exercise-architecture` folder as the **Working directory**. This setting might need to be changed as we keep working on following exercises...
7. Try similar approach by importing `HomeComponent` in the `ProductComponent` and see if the linting error is displayed
8. Try similar approach by importing `ProductComponent` in the `AppComponent` and see if the linting error is displayed


## Congratulations! 
### You have successfully finished the exercise!
Make sure to remember (or write down) any questions you might have 
and ask them as that way everyone learns even more!

## Discussion

* Why are we extracting core setup into a `core` folder instead of keeping it in the `app.*` files?
* What's the advantage of using `export default` in the `<feature-name>.routes.ts` files and how this setup might change in the future?
* What's the main advantage of using architecture validation and how it can help us in the long run?
