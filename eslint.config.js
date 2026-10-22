import { defineConfig } from 'eslint/config'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import vue from 'eslint-plugin-vue'
import boundaries from 'eslint-plugin-boundaries'
import prettier from 'eslint-config-prettier'
import globals from 'globals'
import noComments from './eslint/no-comments.js'

const layers = [
  { type: 'model', pattern: 'src/model/**' },
  { type: 'api', pattern: 'src/api/**' },
  { type: 'ui', pattern: 'src/ui/**' },
  { type: 'fields', pattern: 'src/fields/**' },
  { type: 'features', pattern: 'src/features/**' },
  { type: 'app', pattern: 'src/app/**' },
]

const may = (from, to) => ({
  from: { element: { type: from } },
  allow: { to: { element: { types: { anyOf: to } } } },
})

export default defineConfig(
  { ignores: ['dist', 'node_modules', '.shots', 'src/api/generated.ts', 'playwright-report', 'test-results'] },
  js.configs.recommended,
  tseslint.configs.recommended,
  vue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },
  {
    files: ['**/*.{ts,vue,js}'],
    plugins: { erm: { rules: { 'no-comments': noComments } } },
    rules: { 'erm/no-comments': 'error' },
  },
  {
    files: ['src/**/*.{ts,vue}'],
    ignores: ['src/**/*.test.ts'],
    plugins: { boundaries },
    settings: {
      'boundaries/elements': layers.map((layer) => ({ ...layer, partialMatch: false })),
      'import/resolver': { typescript: { project: './tsconfig.app.json' } },
    },
    rules: {
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          policies: [
            may('model', ['model']),
            may('api', ['api', 'model']),
            may('ui', ['ui']),
            may('fields', ['fields', 'model', 'ui']),
            may('features', ['features', 'fields', 'api', 'model', 'ui']),
            may('app', ['app', 'features', 'fields', 'api', 'model', 'ui']),
          ],
        },
      ],
    },
  },
  {
    files: ['src/ui/**/*.vue'],
    rules: { 'vue/multi-word-component-names': 'off' },
  },
  {
    files: ['**/*.vue'],
    rules: { 'vue/require-default-prop': 'off' },
  },
  {
    files: ['*.{js,ts}', 'scripts/**', 'eslint/**', 'e2e/**'],
    languageOptions: { globals: globals.node },
  },
  prettier,
)
