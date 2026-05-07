<div align="center">

# nook

**a peer support platform for the hard days.**
not therapy, not a wellness app. just a place to be heard.

[![License: PolyForm NC 1.0.0](https://img.shields.io/badge/license-PolyForm_NC_1.0.0-blue.svg)](./LICENSE)
[![Status: early development](https://img.shields.io/badge/status-early_development-orange.svg)](#status)
[![Built with TypeScript](https://img.shields.io/badge/built_with-TypeScript-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

</div>

---

## what is this

nook is a small platform for young adults going through hard moments —
anxiety, overwhelm, loneliness, the kind of bad day where talking to a
therapist feels like too much but scrolling Instagram feels like too little.

it's built around the idea that **being heard is enough sometimes**. you
check in with how you feel, and from there you can vent, listen to someone
else, write privately in a journal nobody reads, or just sit quiet in a
small group of people having the same kind of day.

no streaks. no mood graphs from 1 to 10. no coach voice telling you to
"elevate your journey". just a space.

## what it isn't

- **not a therapy replacement** — if you're in crisis, please reach out
  to [CVV (188)](https://www.cvv.org.br/) or a mental health professional.
- **not a meditation app** — no breathing exercises with whale sounds.
- **not a social network** — no feed, no likes, no follower count.
- **not a diary app** — diary is one feature, not the whole product.
- **not for sale** — see the [License](#license) section.

## stack

**frontend**
[Next.js 15](https://nextjs.org/) ·
[React 19](https://react.dev/) ·
[TypeScript 5.9](https://www.typescriptlang.org/) ·
[Tailwind CSS](https://tailwindcss.com/)

**backend**
[NestJS 10](https://nestjs.com/) ·
[Prisma 6](https://www.prisma.io/) ·
[Zod 4](https://zod.dev/) ·
[Node 22](https://nodejs.org/)

**data & infra**
[Supabase](https://supabase.com/) (Postgres + Auth + Realtime + Storage) ·
[Redis](https://redis.io/) ·
[BullMQ](https://docs.bullmq.io/) (background jobs)

**tooling**
[pnpm](https://pnpm.io/) workspaces ·
[Turborepo](https://turbo.build/) ·
[ESLint 9](https://eslint.org/) (flat config) ·
[Prettier 3](https://prettier.io/)

## architecture

monorepo organized by responsibility:

```
nook/
├── apps/
│   ├── api/          # NestJS backend (REST API)
│   └── web/          # Next.js frontend (App Router) — coming soon
├── packages/
│   ├── config/       # shared tsconfig, eslint, prettier
│   ├── database/     # Prisma schema + generated client
│   └── shared/       # cross-app types and Zod schemas
├── pnpm-workspace.yaml
└── turbo.json
```

**a few decisions worth mentioning:**

- **Supabase Auth** owns `auth.users`. NestJS syncs to `public.users` on
  first login (explicit, not a hidden trigger).
- **RLS everywhere** — Postgres Row Level Security on every table. backend
  connects with a limited role (`nook_app`) and sets `app.current_user_id`
  per transaction.
- **diary stays private** — strict RLS, never logged, admin access requires
  a documented reason and is audited.
- **realtime via Supabase** — frontend subscribes directly to channels with
  a JWT, no need to push everything through the backend.

## status

this is a personal project, very much in progress. building in the open
because i learn better that way.

- [x] database schema (29 tables, 18 enums, RLS, seeds)
- [x] monorepo setup (pnpm + Turbo + TS strict)
- [x] shared types and Zod schemas
- [x] API scaffolding (NestJS, health check)
- [x] linting & formatting (ESLint 9 flat + Prettier)
- [ ] Prisma client generation
- [ ] auth module (Supabase JWT verification + user sync)
- [ ] check-in flow (the entry point of the product)
- [ ] vent / listen module
- [ ] private diary
- [ ] small circles
- [ ] moderation tools
- [ ] frontend (Next.js)

## running locally

> ⚠️ not ready yet. when it is, this section will tell you how.

requirements (for when the time comes):

- Node.js 22+
- pnpm 10+
- a Supabase project (free tier works)
- Redis (local or Upstash)

## license

[PolyForm Noncommercial 1.0.0](./LICENSE).

short version: you can read the code, learn from it, fork it, contribute,
run it for personal/educational use. you **cannot** use it commercially or
build a paid product on top of it. this is a personal non-profit project
and i'd like to keep it that way.

## about

built by [Gabriel](https://github.com/gabriel03013) — 16, full-stack dev
at PicPay, learning in public.

if you want to talk about the project, mental health tech in general, or
anything really, my contacts are on my [profile](https://github.com/gabriel03013).

---

<div align="center">
<sub>if you're going through something difficult, please reach out to
<a href="https://www.cvv.org.br/">CVV (188)</a> — free, 24/7, anonymous.</sub>
</div>
