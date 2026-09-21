<img height="60" src="https://angularexperts.io/assets/images/logo/angular-experts.svg">

# Modern Angular Workshop

by [@tomastrajan](https://twitter.com/tomastrajan) from [AngularExperts.io](https://angularexperts.io)

# Welcome to exercise - Architecture

In this exercise, we're going to explore how to scaffold an application architecture and automatic architecture validation. We are going to learn the following topics:

- How to prepare a folder structure to reflect architectural building blocks
- How to define automated architecture validation
- How to create **standalone** `core` with `provideCore() {}`
- How to create a main layout
- How to create **route** based lazy features
- **How to effectively use IDE features like schematics, linting and code collapsing to speed up development**


## Important preparation

1. Setup IDE **markdown plugin** with custom CSS to improve exercise description readability. In `Settings -> Languages & Frameworks -> Markdown` in the `Custom CSS` section, we're going to add `li {padding: 10px 0; }` and Apply / Save
2. Setup IDE to run prettier with key shortcut (usually `CTRL ALT SHIFT P` in Webstorm / `SHIFT ALT F` in VS Code)
3. Setup IDE expand to level 1, 2, 3, 4, 5 keyboard shortcuts (`Settings -> KeyMap -> search "level"`, eg `CTRL ALT SHIFT 1`, `2`, ...)
4. Setup IDE shortcut to refresh workspace (from disk, useful when CLI creates / changes files in the workspace)
5. Setup IDE shortcut to run Angular Schematics (usually `CTRL ALT SHIFT S`)

**Before we get started, it can be a good idea to adjust Eslint IDE settings, especially the `Working directories` to match the current exercise to prevent false positive errors and warnings.**

## TODO 1 - Prepare folder structure

1. In the `projects/product-app/src/app/` we're going to create the following folders
   - `core`
   - `feature`
   - `layout`
   - `pattern`
   - `ui`

## TODO 2 - Automated architecture validation

1. Let's install `pnpm add -D eslint-plugin-boundaries eslint-import-resolver-typescript`
2. In the project root, let's create a new file called, `eslint.config.boundaries.js` with the following content

```javascript
const boundaries = require('eslint-plugin-boundaries');
const { defineConfig } = require('eslint/config');

module.exports = defineConfig({
  files: ['**/*.ts'],
  plugins: {
    boundaries,
  },
  extends: [boundaries.configs.strict],
  rules: {
    'boundaries/dependencies': [
      'error',
      {
        default: 'disallow',
        policies: [],
      },
    ],
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
    'boundaries/ignore': [],
    'boundaries/dependency-nodes': ['import', 'dynamic-import'],
    'boundaries/files-single-match': true,
    'boundaries/elements': [
      
    ],
    'boundaries/files': [
      
    ],
  },
});
```
3. Let's reference our newly created eslint config file in the main root `eslint.config.js` file by adding the following line at the top of the `defineConfig([...])` array

```javascript
const boundaries = require('./eslint.config.boundaries.js');

module.exports = defineConfig([
  boundaries,
  // other existing configs ...
]);
```

4. Try if everything works as expected by running `ng lint`, the output should show multiple errors about `File does not match any file pattern and does not belong to any known element` which is expected as we're using the `strict` preset which enforces that every file belongs to at least one architectural type.

5. With this setup in place, let's provide definitions for the `'boundaries/elements': []` array

```javascript
{
  type: 'env',
  pattern: 'environments',
  basePattern: 'projects/**/src',
  baseCapture: ['app'],
},
{
  type: 'core',
  pattern: 'core',
  basePattern: 'projects/**/src/app',
  baseCapture: ['app'],
},
{
  type: 'ui',
  pattern: 'ui',
  basePattern: 'projects/**/src/app',
  baseCapture: ['app'],
},
{
  type: 'layout',
  pattern: 'layout',
  basePattern: 'projects/**/src/app',
  baseCapture: ['app'],
},
{
  type: 'pattern',
  pattern: 'pattern',
  basePattern: 'projects/**/src/app',
  baseCapture: ['app'],
},
{
  type: 'feature',
  pattern: 'feature/*',
  capture: ['feature'],
  basePattern: 'projects/**/src/app',
  baseCapture: ['app'],
},
{
  type: 'lib',
  pattern: 'projects/**/src/lib',
  capture: ['lib'],
},
```

And definitions for the `'boundaries/files': []` array

```javascript
{
  category: 'main',
  pattern: 'projects/**/src/main.ts',
  capture: ['app'],
},
{
  category: 'app',
  pattern: 'projects/**/src/app/app?(-|.)*.ts',
  capture: ['app'],
},
{
  category: 'feature-routes',
  pattern: 'projects/**/src/app/feature/*/*.routes.ts',
  capture: ['app', 'feature'],
},
{
  category: 'lib-api',
  pattern: 'projects/**/src/public-api.ts',
  capture: ['lib'],
},
```

6. With this setup in place, let's validate if everything works as expected by running `ng lint`, the output should show new errors, `There is no policy allowing dependencies...`, the files are now correctly recognized as belonging to a specific architectural type, but our default rule is `disallow` which means no file can depend on another if it was not explicitly allowed...

7. Let's fix that by providing the last missing part, the policies in the `'boundaries/dependencies'` `policies: []` array which will unlock specific dependencies between architectural building blocks

```javascript
{
  from: {
    file: {
      categories: 'main',
    },
  },
  allow: {
    to: {
      file: {
        categories: 'app',
        captured: {
          app: '{{from.file.captured.app}}',
        },
      },
    },
  },
},
{
  from: {
    element: {
      type: 'core',
    },
  },
  allow: [
    {
      to: {
        file: {
          categories: 'lib-api',
        },
      },
    },
    {
      to: {
        element: {
          types: ['env', 'core'],
          captured: {
            app: '{{from.element.captured.app}}',
          },
        },
      },
    },
  ],
},
{
  from: {
    element: {
      type: 'ui',
    },
  },
  allow: [
    {
      to: {
        file: {
          categories: 'lib-api',
        },
      },
    },
    {
      to: {
        element: {
          types: ['env', 'ui'],
          captured: {
            app: '{{from.element.captured.app}}',
          },
        },
      },
    },
  ],
},
{
  from: {
    element: {
      types: ['layout', 'pattern', 'feature'],
    },
  },
  allow: [
    {
      to: {
        file: {
          categories: 'lib-api',
        },
      },
    },
    {
      to: {
        element: {
          types: ['env', 'core', 'ui', 'pattern'],
          captured: {
            app: '{{from.element.captured.app}}',
          },
        },
      },
    },
  ],
},
{
  from: {
    file: {
      categories: 'app',
    },
  },
  allow: [
    {
      to: {
        file: {
          categories: 'lib-api',
        },
      },
    },
    {
      to: {
        element: {
          types: ['env', 'core', 'layout'],
          captured: {
            app: '{{from.file.captured.app}}',
          },
        },
      },
    },
    {
      to: {
        file: {
          categories: ['app', 'feature-routes'],
          captured: {
            app: '{{from.file.captured.app}}',
          },
        },
      },
    },
  ],
},
{
  from: {
    element: {
      type: 'feature',
    },
  },
  allow: {
    to: {
      file: {
        categories: 'feature-routes',
        captured: {
          app: '{{from.element.captured.app}}',
        },
      },
    },
  },
},
{
  from: {
    file: {
      categories: 'lib-api',
    },
  },
  allow: {
    to: {
      element: {
        type: 'lib',
        captured: {
          app: '{{from.file.captured.lib}}',
        },
      },
    },
  },
},
{
  from: {
    element: {
      type: 'lib',
    },
  },
  allow: {
    to: {
      element: {
        type: 'lib',
        captured: {
          app: '{{from.element.captured.lib}}',
        },
      },
    },
  },
},
```

8. Once again, let's validate if everything works as expected by running `ng lint`, the output should be that there are no lint errors!

## TODO 3 - Create standalone `core` with `provideCore() {}`

1. In the `projects/product-app/src/app/core/` we're going to create a new `core.ts` file
2. In the `core.ts` file we're going to define a new `provideCore()` function that will provide global infrastructure and services to be used by the rest of the application

```typescript
export function provideCore() {
     return [];
}
```

3. In general, we want to move whole setup into the `core` away from the `app.*` and therefore we're going to introduce `CoreOptions` interface that will allow us to pass additional configuration to the `provideCore()` function

```typescript
export interface CoreOptions {
  routes: Routes;
}

export function provideCore(options: CoreOptions) {
  return [];
}
```

4. Now, it's time to import and use the `provideCore()` function in the `app.config.ts` file and pass in `routes` in an options object

```typescript
export const appConfig: ApplicationConfig = {
  providers: [provideCore({ routes })],
  // notice that we have removed provideRouter(routes)
  // and we should also clean up the imports
};
```

5. Let's move the `provideRouter(routes)` into the `provideCore()` function and remove them from the `app.config.ts` file

```typescript
export function provideCore(options: CoreOptions) {
  return [provideRouter(options.routes)];
}
```

6. Let's verify that everything works as expected by running `pnpm start`...

7. As we are using Angular Material, we're going to provide also some global setup for this library, first we're going to pre-configure appearance of all form fields, this can be achieved by specifying following provider...

```typescript
{
   provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
   useValue: { appearance: 'outline' },
},
```

8. Last part of the core setup is to provide `provideEnvironmentInitializer` where we provide setup which requires injection of some service and kickstart global processes as well...

```typescript
// perform initialization, has to be last
provideEnvironmentInitializer(() => {
   // add init logic here...
   // kickstart processes, trigger initial requests or actions, ...

   inject(MatIconRegistry).setDefaultFontSetClass(
     'material-symbols-outlined',
   )
}),
```

Previously this was done with the `ENVIRONMENT_INITIALIZER` multi token but the new standalone `provideEnvironmentInitializer` provides better DX and is more consistent with the rest of Angular APIs...

## TODO 4 - Create the main layout

With the core in place, let's create a main layout for our application.

1. In the `projects/product-app/src/app/layout/` we're going to create a new `main-layout` component with the help of Angular Schematics, try to use IDE integration instead of CLI
2. With the component in place, let's add it to the template of the `app.component.ts` (inline template), the IDE should auto import the `MainLayoutComponent` and add it to the `imports: []` array of the `AppComponent` (else make sure to do it manually), also because we're NOT projecting any content into `<my-org-main-layout>` we can use Angular "self-closing" tag syntax `<my-org-main-layout />` which is shorter!
3. Let's see it running by running `pnpm start` (we might need to restart our serve process to make sure build found all the new files)...
4. Continue by adding the following template to the `main-layout.component.html` file

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

5. With the markup in place, we have to make sure that **all components and directives** that are used in the template have to be imported and added to the `imports: []` array of the `MainLayoutComponent`, IDE should be helpful and provide it as an option when selecting components and directives in the template, else do it manually...
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
            loadComponent: () =>
              import('./home/home.component').then((m) => m.HomeComponent),
         },
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
5. Let's verify that everything works as expected by running `pnpm start` and navigating to the `http://localhost:4200/home` URL in the browser (try to restart `serve` or perform a hard browser refresh if it doesn't work)
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
6. (Troubleshooting) If that's not the case, try to adjust `Eslint` settings in your IDE by selecting **Manual configuration** and using the `exercise-architecture` folder as the **Working directory**. This setting might need to be changed as we keep working on following exercises...
7. Try similar approach by importing `HomeComponent` in the `ProductComponent` and see if the linting error is displayed
8. Try similar approach by importing `ProductComponent` in the `AppComponent` and see if the linting error is displayed


## TODO 7 - Scoped providers and cleanup

1. Let's generate a new `product` service in the product feature using Angular Schematics (IDE integration)
2. Add `autoProvided: false` to the generated `@Service()` decorator of the `ProductService`, resulting in `@Service({ autoProvided: false })`, to prevent it from being automatically provided in the root injector
3. Add `ProductService` to the product feature route's `providers` array in `product.routes.ts`: `providers: [ProductService]`
4. In `ProductService`, add `console.log('ProductService created')` to the constructor. Inject `DestroyRef` and store it in a JavaScript private property named `#destroy`, then register an `onDestroy` callback in the constructor that logs `console.log('ProductService destroyed')`
5. Let's inject the service into the product component to make sure that it is instantiated when user navigates to the product feature
6. In the running app, navigate to and away from the product feature and check the console, you should NOT see the `ProductService destroyed` as by default, providers in the lazy loaded route injector are created on first navigation and live for the whole lifespan of the application
7. In `core.ts`, import `withExperimentalAutoCleanupInjectors` from `@angular/router` and add `withExperimentalAutoCleanupInjectors()` to the `provideRouter` call. This opt-in feature is [still experimental in Angular 22](https://angular.dev/api/router/withExperimentalAutoCleanupInjectors)
8. Let's try navigation to and away from the product feature again and check the console, you should see the `ProductService destroyed` message in the console which means that the route injector was automatically cleaned up after navigating away from the feature!

## Congratulations! 
### You have successfully finished the exercise!
Make sure to remember (or write down) any questions you might have 
and ask them as that way everyone learns even more!

## Discussion

* Why are we extracting core setup into a `core` folder instead of keeping it in the `app.*` files?
* What's the advantage of using `export default` in the `<feature-name>.routes.ts` files and how this setup might change in the future?
* What's the purpose of scoping feature-specific services (and other providers) in the `providers: []` array of the feature route config?
* What's the difference between providing service in an injector and actually instantiating it (where to inject based on purpose, component vs env initializer)
* What's the main advantage of using architecture validation and how it can help us in the long run?
* What's the main benefit of new "auto cleanup" injector feature and how it relates to the default behavior of components that belong to a given lazy feature?
