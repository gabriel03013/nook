// Placeholder landing page.
// Visual identity (palette, typography, layout) is being explored separately
// and will land in a follow-up PR alongside Tailwind v4 + design tokens.
// Inline styles here are intentional and TEMPORARY.
export default function HomePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <h1 style={{ fontSize: '2rem', fontWeight: 400, letterSpacing: '-0.02em' }}>
        nook
      </h1>
    </main>
  );
}
