// Placeholder landing page.
// Real product pages (abrigo, sussurros, diário) come in follow-up PRs.
// This page exists only to verify that:
//   - Tailwind v4 is wired and emitting utility classes
//   - Design tokens (bg-surface, text-content) resolve correctly
//   - Manrope is loaded and applied as the default sans
export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface">
      <h1 className="text-4xl font-light tracking-tight text-content">
        nook
      </h1>
    </main>
  );
}
