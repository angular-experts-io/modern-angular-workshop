// @ts-check
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

const boundaries = require('./eslint.config.boundaries.js');

module.exports = defineConfig([
  boundaries,
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'my-org',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'my-org',
          style: 'kebab-case',
        },
      ],
      'no-unused-private-class-members': ['off'],
      '@angular-eslint/no-output-native': ['off'],
      '@angular-eslint/no-input-rename': ['off'],
      '@angular-eslint/no-host-metadata-property': ['off'],
      '@typescript-eslint/consistent-type-assertions': ['off'],
      '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
    },
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {
      '@angular-eslint/template/button-has-type': 'error',
    },
  },
]);
