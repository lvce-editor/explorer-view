import { defineConfig } from 'eslint/config'
import * as config from '@lvce-editor/eslint-config'

export default defineConfig([
  ...config.default,
  ...config.recommendedVirtualDom,
  ...config.recommendedRegex,
  ...config.recommendedTsconfig,
  ...config.recommendedActions,
  {
    files: ['**/*.ts'],
    rules: {
      '@cspell/spellchecker': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      'no-case-declarations': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/restrict-plus-operands': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-dynamic-delete': 'off',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
      'prefer-destructuring': 'off',
      'unicorn/no-for-loop': 'off',
      'jest/no-identical-title': 'off',
      'unicorn/prefer-single-call': 'off',
      'unicorn/no-immediate-mutation': 'off',
      'unicorn/empty-brace-spaces': 'off',
      '@typescript-eslint/only-throw-error': 'off',
      '@typescript-eslint/await-thenable': 'off',
      '@typescript-eslint/no-import-type-side-effects': 'error',
    },
  },
  {
    files: ['**/*.test.ts'],
    rules: {
      '@typescript-eslint/unbound-method': 'off',
      'virtual-dom/no-object-attribute-values': 'off',
      'virtual-dom/no-raw-text-children': 'off',
      'virtual-dom/prefer-merge-class-names': 'off',
    },
  },
  ...config.recommendedActions,
  {
    rules: {
      'github-actions/needs': 'off',
      'github-actions/permissions': 'off',
    },
  },
  {
    files: ['packages/e2e/**/*.ts'],
    rules: {
      'e2e/prefer-filesystem-set-files': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/no-redundant-type-constituents': 'off',
    },
  },
  {
    files: ['packages/e2e/scripts/**/*.ts'],
    rules: {
      'e2e/no-imports': 'off',
    },
  },
  {
    files: ['**/*.test.ts'],
    rules: {
      'jest/no-disabled-tests': 'off',
    },
  },
  {
    files: ['.devcontainer/devcontainer.json'],
    rules: {
      'devcontainer/require-desktop-lite-feature': 'off',
      'devcontainer/allowed-image': 'off',
    },
  },
  {
    files: ['package.json'],
    rules: {
      'package-json/valid-main': 'off',
    },
  },
  {
    files: ['packages/explorer-view/src/parts/HandleKeyDown/HandleKeyDown.ts'],
    rules: {
      'sonarjs/void-use': 'off',
    },
  },
])
