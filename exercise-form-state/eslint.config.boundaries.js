const boundaries = require('eslint-plugin-boundaries');
const { defineConfig } = require('eslint/config');

module.exports = defineConfig({
  files: ['**/*.ts'],
  plugins: { boundaries },
  extends: [boundaries.configs.strict],
  rules: {
    'boundaries/dependencies': [
      'error',
      {
        default: 'disallow',
        policies: [
          {
            from: { file: { categories: 'main' } },
            allow: {
              to: {
                file: {
                  categories: 'app',
                  captured: { app: '{{from.file.captured.app}}' },
                },
              },
            },
          },
          {
            from: { element: { type: 'core' } },
            allow: [
              { to: { file: { categories: 'lib-api' } } },
              {
                to: {
                  element: {
                    types: ['env', 'core'],
                    captured: { app: '{{from.element.captured.app}}' },
                  },
                },
              },
            ],
          },
          {
            from: { element: { type: 'ui' } },
            allow: [
              { to: { file: { categories: 'lib-api' } } },
              {
                to: {
                  element: {
                    types: ['env', 'ui'],
                    captured: { app: '{{from.element.captured.app}}' },
                  },
                },
              },
            ],
          },
          {
            from: {
              element: { types: ['layout', 'pattern', 'feature'] },
            },
            allow: [
              { to: { file: { categories: 'lib-api' } } },
              {
                to: {
                  element: {
                    types: ['env', 'core', 'ui', 'pattern'],
                    captured: { app: '{{from.element.captured.app}}' },
                  },
                },
              },
            ],
          },
          {
            from: { file: { categories: 'app' } },
            allow: [
              { to: { file: { categories: 'lib-api' } } },
              {
                to: {
                  element: {
                    types: ['env', 'core', 'layout', 'pattern'],
                    captured: { app: '{{from.file.captured.app}}' },
                  },
                },
              },
              {
                to: {
                  file: {
                    categories: ['app', 'feature-routes'],
                    captured: { app: '{{from.file.captured.app}}' },
                  },
                },
              },
            ],
          },
          {
            from: { element: { type: 'feature' } },
            allow: {
              to: {
                file: {
                  categories: 'feature-routes',
                  captured: { app: '{{from.element.captured.app}}' },
                },
              },
            },
          },
          {
            from: { file: { categories: 'lib-api' } },
            allow: {
              to: {
                element: { type: 'lib', captured: { app: '{{from.file.captured.lib}}' } },
              },
            },
          },
          {
            from: { element: { type: 'lib' } },
            allow: {
              to: {
                element: {
                  type: 'lib',
                  captured: { app: '{{from.element.captured.lib}}' },
                },
              },
            },
          },
        ],
      },
    ],
  },
  settings: {
    'import/resolver': { typescript: { alwaysTryTypes: true } },
    'boundaries/ignore': [],
    'boundaries/dependency-nodes': ['import', 'dynamic-import'],
    'boundaries/elements': [
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
      { type: 'lib', pattern: 'projects/**/src/lib', capture: ['lib'] },
    ],
    'boundaries/files-single-match': true,
    'boundaries/files': [
      { category: 'main', pattern: 'projects/**/src/main.ts', capture: ['app'] },
      { category: 'app', pattern: 'projects/**/src/app/app?(-|.)*.ts', capture: ['app'] },
      {
        category: 'feature-routes',
        pattern: 'projects/**/src/app/feature/*/*.routes.ts',
        capture: ['app', 'feature'],
      },
      { category: 'lib-api', pattern: 'projects/**/src/public-api.ts', capture: ['lib'] },
    ],
  },
});
