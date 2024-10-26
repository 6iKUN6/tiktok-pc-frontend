import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      sourceType: 'module'
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier,
      import: importPlugin
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      'space-before-function-paren': 0,
      'generator-star-spacing': 'off',
      'object-curly-spacing': 0, // 强制在大括号中使用一致的空格
      'array-bracket-spacing': 0, // 方括号
      'no-debugger': 'off',
      'prefer-const': [
        'error',
        { destructuring: 'any', ignoreReadBeforeAssign: false }
      ],

      'padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: 'directive',
          next: '*'
        },
        {
          blankLine: 'always',
          prev: 'block-like',
          next: '*'
        },
        {
          blankLine: 'always',
          prev: '*',
          next: 'function'
        },
        {
          blankLine: 'always',
          prev: 'function',
          next: '*'
        }
      ],

      'import/order': [
        'error',
        {
          groups: [
            ['builtin', 'external'],
            'internal',
            ['parent', 'sibling', 'index']
          ],
          'newlines-between': 'always'
        }
      ]
    },
  },
)
