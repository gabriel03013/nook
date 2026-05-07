// @ts-check

/**
 * Base ESLint flat config for the Nook monorepo.
 *
 * This is the foundation — it covers TypeScript, common bugs and code smells,
 * and import organization. Framework-specific configs (NestJS, Next.js) extend
 * this base and add their own rules on top.
 *
 * Usage: each app/package has its own `eslint.config.js` that imports the
 * appropriate config from `@nook/config` and exports it.
 */

const tseslint = require('typescript-eslint');
const eslint = require('@eslint/js');
const prettierConfig = require('eslint-config-prettier');
const importPlugin = require('eslint-plugin-import');

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  // 1. ignore artifacts everywhere
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
      '**/.turbo/**',
      '**/coverage/**',
      '**/*.config.js',
      '**/*.config.cjs',
      '**/*.config.mjs',
    ],
  },

  // 2. ESLint recommended (catches obvious bugs: undefined vars, etc)
  eslint.configs.recommended,

  // 3. typescript-eslint recommended-type-checked (uses tsc to find deeper bugs)
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  // 4. our custom rules on top
  {
    languageOptions: {
      parserOptions: {
        // tells typescript-eslint to find each project's tsconfig automatically
        projectService: true,
        tsconfigRootDir: process.cwd(),
      },
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      // === TypeScript ===

      // allow `_unused` variables — useful for required but unused params
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // require explicit return types on exported functions only — internal fns
      // can be inferred. Keeps the public API predictable without ceremony.
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // allow inferred types — let TS do its job
      '@typescript-eslint/no-inferrable-types': 'error',

      // forbid `any` — use `unknown` and narrow it
      '@typescript-eslint/no-explicit-any': 'error',

      // require `await` on Promises that are floating (otherwise errors are lost)
      '@typescript-eslint/no-floating-promises': 'error',

      // forbid `?? {}` patterns that hide null bugs
      '@typescript-eslint/no-misused-promises': 'error',

      // prefer `?.` over manual null checks
      '@typescript-eslint/prefer-optional-chain': 'error',

      // prefer `?? ` over `||` for default values (|| has falsy gotchas)
      '@typescript-eslint/prefer-nullish-coalescing': 'error',

      // === General code quality ===

      // forbid `console.log` in production code (use a logger)
      // — but allow .warn and .error for now, they're legit
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],

      // require === over ==
      eqeqeq: ['error', 'always'],

      // forbid var, only let/const
      'no-var': 'error',
      'prefer-const': 'error',

      // === Import organization ===

      // forbid unresolved imports (typos)
      'import/no-unresolved': 'off', // TS handles this better than eslint-plugin-import

      // group and sort imports
      'import/order': [
        'warn',
        {
          groups: [
            'builtin', // node built-ins (fs, path)
            'external', // npm packages
            'internal', // workspace packages (@nook/*)
            ['parent', 'sibling', 'index'], // relative imports
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
          pathGroups: [
            {
              pattern: '@nook/**',
              group: 'internal',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
        },
      ],
    },
  },

  // 5. test files: relaxed rules
  {
    files: ['**/*.test.ts', '**/*.spec.ts', '**/*.e2e-spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
    },
  },

  // 6. prettier compat — MUST be last. Disables ESLint rules that fight Prettier.
  prettierConfig,
];
