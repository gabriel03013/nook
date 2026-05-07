// @ts-check

/**
 * ESLint flat config for NestJS apps.
 *
 * Extends the base config and adds Nest-specific tweaks:
 * - relaxes rules around decorators (@Injectable, @Controller, etc)
 * - allows empty constructors (DI pattern)
 * - allows classes with only static methods (utility patterns)
 */

const baseConfig = require('./eslint.config.base.js');

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  ...baseConfig,

  {
    rules: {
      // NestJS uses decorators heavily — emitDecoratorMetadata is on, so
      // type-only imports for DI tokens (e.g. `Logger`) need to be runtime imports.
      // We disable consistent-type-imports because it conflicts with this pattern.
      '@typescript-eslint/consistent-type-imports': 'off',

      // Empty constructors are common in NestJS for DI:
      //   constructor(private readonly userService: UserService) {}
      'no-useless-constructor': 'off',
      '@typescript-eslint/no-useless-constructor': 'off',

      // Classes with only static methods are valid in Nest (e.g. helper services
      // that don't need DI). The base rule complains, we don't want that.
      '@typescript-eslint/no-extraneous-class': 'off',

      // NestJS exception filters and interceptors often have fns that look unused
      // because they're called by the framework. Be more lenient.
      '@typescript-eslint/no-unsafe-argument': 'warn',
    },
  },
];
