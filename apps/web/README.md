# `@nook/web`

Frontend público da plataforma nook — Next.js 15 + App Router + React 19.

## como rodar

A partir da raiz do monorepo:

```bash
pnpm --filter @nook/web dev
```

Sobe em [http://localhost:3000](http://localhost:3000) com Turbopack.

Outros scripts:

```bash
pnpm --filter @nook/web build       # build de produção
pnpm --filter @nook/web start       # serve o build
pnpm --filter @nook/web lint        # ESLint
pnpm --filter @nook/web typecheck   # tsc --noEmit
```

## o que tem aqui hoje

Esqueleto técnico + design tokens. Página inicial é um placeholder com
`<h1>nook</h1>` usando os tokens reais (`bg-surface`, `text-content`,
fonte Manrope) — serve como prova de que tudo tá plugado.

Identidade visual completa (telas reais, componentes, layout) entra em
PRs separadas. **Não decore esse placeholder** — ele vai embora.

## o que NÃO tem aqui ainda

- Componentes (Button, Card, Input, etc)
- Páginas reais (abrigo, sussurros, diário)
- Imagens / favicon real
- `@nook/shared` plugado (vem em outro PR)

## design tokens

Definidos em `app/globals.css` via `@theme`. Duas camadas:

- **Primitivos** (`--color-bg`, `--color-moss`…): valores RAW. **Nunca**
  use direto em componentes.
- **Semânticos** (`--color-surface`, `--color-content`,
  `--color-accent-primary`…): descrevem propósito. **Sempre** use estes.

Tokens viram classes Tailwind automaticamente: `bg-surface`,
`bg-surface-card`, `text-content`, `text-content-muted`,
`bg-accent-primary`, `border-divider`, etc.

Conceito: **"Abrigo na Penumbra"** — base dark warm-neutral, dois
acentos dessaturados (Musgo + Argila), hierarquia de texto em 4 níveis
com mesmo undertone marfim.

Fonte: **Manrope** (variable, self-hosted em `public/fonts/`).
Originalmente do Fontsource (mirror open source do Google Fonts,
MIT). Self-hosted ao invés de `next/font/google` por 2 motivos:
funciona atrás de proxies corporativos restritivos (Zscaler) e
não depende de CDN do Google em build/runtime.

## convenções

- Configs centralizadas em `@nook/config` (re-exportadas via
  `eslint.config.js`, `prettier.config.js`, `tsconfig.json`).
- TypeScript strict via `@nook/config/tsconfig.next.json`.
- Path alias `@/*` aponta pra `app/*`.
- App Router (sem `pages/`).
