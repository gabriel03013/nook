/**
 * Prettier shared config for the Nook monorepo.
 * Re-exported by each app/package via `prettier.config.js`.
 */
module.exports = {
  // line width — 100 is the sweet spot between long screens and readability
  printWidth: 100,

  // 2 spaces, no tabs
  tabWidth: 2,
  useTabs: false,

  // semicolons at end of statements
  semi: true,

  // single quotes for strings — easier to type, less visual noise
  singleQuote: true,

  // double quotes in JSX (React convention)
  jsxSingleQuote: false,

  // always use trailing commas — git diffs stay clean when adding new items
  trailingComma: 'all',

  // spaces inside object literals: { foo } not {foo}
  bracketSpacing: true,

  // > on new line in JSX (helps readability with many props)
  bracketSameLine: false,

  // always wrap arrow fn params in parens: (x) => x, not x => x
  arrowParens: 'always',

  // line endings: LF (unix). CRLF only on legacy Windows projects.
  endOfLine: 'lf',
};