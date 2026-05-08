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

Só o esqueleto técnico. Página inicial é um placeholder com `<h1>nook</h1>`
e estilo inline temporário.

Identidade visual (paleta, tipografia, Tailwind v4, design tokens, landing
real) entra em PRs separadas. **Não decore esse placeholder** — ele vai
embora.

## o que NÃO tem aqui ainda

- Tailwind / CSS framework
- Design tokens
- Fontes customizadas
- Imagens / favicon real
- `@nook/shared` plugado (vem em outro PR)
- Páginas de produto

## convenções

- Configs centralizadas em `@nook/config` (re-exportadas via
  `eslint.config.js`, `prettier.config.js`, `tsconfig.json`).
- TypeScript strict via `@nook/config/tsconfig.next.json`.
- Path alias `@/*` aponta pra `app/*`.
- App Router (sem `pages/`).
