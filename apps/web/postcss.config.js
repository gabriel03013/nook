// PostCSS config for @nook/web.
// Tailwind v4 ships its PostCSS plugin as a separate package; this is the
// only entry point Next.js needs to pick it up automatically.
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
