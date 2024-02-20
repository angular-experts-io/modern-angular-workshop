<img height="60" src="https://angularexperts.io/assets/images/logo/angular-experts.svg">

# Modern Angular Workshop

by [@tomastrajan](https://twitter.com/tomastrajan) from [AngularExperts.io](https://angularexperts.io)

# Welcome to exercise - Architecture

In this exercise were going to explore how to scaffold an application architecture and automatic architecture validation. We are going to learn the following topics:

- How to prepare folder structure to reflect architectural building blocks
- How to define automated architecture validation
- How to create **standalone** `core` with `provideCore() {}`
- How to create main layout
- How to create **route** based lazy features

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
  'import/resolver': {
    typescript: {
      alwaysTryTypes: true,
    },
  },
  'boundaries/ignore': ['**/jest*.{js,ts}'],
  'boundaries/dependency-nodes': ['import', 'dynamic-import'],
  'boundaries/elements': [
    /* we're going to provide definitions in the next step */
  ],
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
    "pattern": "app*.ts",
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
    "pattern": "ui/*",
    "basePattern": "projects/**/src/app",
    "baseCapture": ["app"]
  },
  {
    "type": "layout",
    "pattern": "layout/*",
    "basePattern": "projects/**/src/app",
    "baseCapture": ["app"]
  },
  {
    "type": "pattern",
    "pattern": "pattern/*",
    "capture": ["pattern"],
    "basePattern": "projects/**/src/app",
    "baseCapture": ["app"]
  },
  {
    "type": "shared-feature-routes",
    "mode": "file",
    "pattern": "feature/shared-*/*.routes.ts",
    "capture": ["feature"],
    "basePattern": "projects/**/src/app",
    "baseCapture": ["app"]
  },
  {
    "type": "shared-feature",
    "pattern": "feature/shared-*",
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
[
  'error',
  {
    default: 'disallow',
    rules: [
      {
        from: 'main',
        allow: [['app', { app: '${from.app}' }]],
      },
      {
        from: 'core',
        allow: [['lib-api'], ['env', { app: '${from.app}' }], ['core', { app: '${from.app}' }]],
      },
      {
        from: 'ui',
        allow: [['lib-api'], ['env', { app: '${from.app}' }], ['ui', { app: '${from.app}' }]],
      },
      {
        from: 'layout',
        allow: [['lib-api'], ['env', { app: '${from.app}' }], ['core', { app: '${from.app}' }], ['ui', { app: '${from.app}' }]],
      },
      {
        from: 'app',
        allow: [['lib-api'], ['env', { app: '${from.app}' }], ['app', { app: '${from.app}' }], ['core', { app: '${from.app}' }], ['layout', { app: '${from.app}' }], ['feature', { app: '${from.app}' }]],
      },
      {
        from: ['pattern'],
        allow: [['lib-api'], ['env', { app: '${from.app}' }], ['core', { app: '${from.app}' }], ['ui', { app: '${from.app}' }], ['pattern', { app: '${from.app}' }]],
      },
      {
        from: ['shared-feature'],
        allow: [['lib-api'], ['env', { app: '${from.app}' }], ['core', { app: '${from.app}' }], ['ui', { app: '${from.app}' }], ['pattern', { app: '${from.app}' }]],
      },
      {
        from: ['shared-feature-routes'],
        allow: [['lib-api'], ['env', { app: '${from.app}' }], ['core', { app: '${from.app}' }], ['shared-feature', { app: '${from.app}' }]],
      },
      {
        from: ['feature'],
        allow: [['lib-api'], ['env', { app: '${from.app}' }], ['core', { app: '${from.app}' }], ['ui', { app: '${from.app}' }], ['pattern', { app: '${from.app}' }], ['shared-feature-routes', { app: '${from.app}' }]],
      },

      {
        from: ['lib-api'],
        allow: [['lib', { app: '${from.lib}' }]],
      },
      {
        from: ['lib'],
        allow: [['lib', { app: '${from.lib}' }]],
      },
    ],
  },
]
```

6. Once again, let's validate if everything works as expected by running `ng lint`, the output should be that there are no lint errors!

## TODO 3 - Create standalone `core` with `provideCore() {}`

1. In the `projects/product-app/src/app/core/` we're going to create a new `core.ts` file
2. In the `core.ts` file we're going to define a new `provideCore()` function that will provide global infrastructure and services to be used by the rest of the application

```typescript
export function provideCore() {
  return []
```
```
