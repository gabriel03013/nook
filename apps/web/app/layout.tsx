import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';

import './globals.css';

// Manrope — humanist sans, geometric but warm.
// Self-hosted from public/fonts (originally sourced from Fontsource, the
// open-source mirror of Google Fonts, MIT-licensed). Local hosting means:
//   - zero runtime requests to Google (GDPR-safe)
//   - works behind restrictive corporate proxies (Zscaler etc)
//   - no build-time download dance
//   - zero CLS via next/font's automatic fallback metrics
//
// One variable file covers all weights from 200 to 800.
const manrope = localFont({
  src: '../public/fonts/manrope-variable.woff2',
  variable: '--font-manrope',
  display: 'swap',
  weight: '200 800',
});

export const metadata: Metadata = {
  title: 'nook',
  description: 'apoio emocional entre pares',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#131313',
};

export default function RootLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <html lang="pt-BR" className={manrope.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
