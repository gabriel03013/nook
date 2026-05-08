import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

// Intentionally minimal metadata for the scaffold.
// Real branding (title, description, OG tags) lands with the design system PR.
export const metadata: Metadata = {
  title: 'nook',
  description: 'apoio emocional entre pares',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // No theme-color yet — comes with the visual identity PR.
};

export default function RootLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
