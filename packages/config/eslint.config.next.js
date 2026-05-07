// @ts-check

/**
 * ESLint flat config for Next.js apps.
 *
 * Extends the base config and adds:
 * - React hooks rules (mandatory for any React project)
 * - JSX accessibility (a11y) rules
 * - Next.js-specific rules (next/image, next/link, etc)
 *
 * Note: Next.js 15+ supports flat config natively. For older versions,
 * you'd need to use FlatCompat — we don't, so this assumes Next 15+.
 */

const baseConfig = require('./eslint.config.base.js');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const jsxA11yPlugin = require('eslint-plugin-jsx-a11y');
const nextPlugin = require('@next/eslint-plugin-next');

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  ...baseConfig,

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
      '@next/next': nextPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        React: 'readonly',
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // === React core ===
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules, // no need to import React in scope (Next 13+)

      // we don't validate prop-types — we use TypeScript instead
      'react/prop-types': 'off',

      // self-closing tags: <Foo /> instead of <Foo></Foo>
      'react/self-closing-comp': 'error',

      // === React hooks (CRITICAL — these prevent real bugs) ===
      ...reactHooksPlugin.configs.recommended.rules,

      // === Accessibility ===
      ...jsxA11yPlugin.configs.recommended.rules,

      // === Next.js ===
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
];
