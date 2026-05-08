# `modules/`

Feature-based domain modules live here.

Each module is a self-contained NestJS module that owns a slice of the
product domain (auth, users, posts, comments, check-ins, circles, etc).

## When to create a module

Create a new module when adding a new domain concept with its own
endpoints, business rules or persistence concerns. Avoid creating a
module just to host a single helper — those belong in `common/` or
`infrastructure/`.

## Folder structure

Modules start **flat**. They only grow subfolders when the file count
or coupling actually starts to hurt — never preventively.

### Flat (default — start here)

```
modules/<feature>/
├── <feature>.module.ts
├── <feature>.controller.ts
├── <feature>.service.ts
└── <feature>.service.spec.ts
```

### Grown (only when it hurts)

```
modules/<feature>/
├── <feature>.module.ts
├── controllers/
├── services/
├── dto/                ← Zod schemas + inferred types
├── domain/             ← entities, value objects, domain services
└── repositories/       ← Prisma data access
```

DTOs are **always Zod schemas** (validated via the global
`ZodValidationPipe` + `ZodExceptionFilter` in `common/`). Never
class-validator.

## What does NOT belong here

- **Cross-cutting concerns** (pipes, filters, guards, decorators)
  → `common/`
- **Singleton clients** (Prisma, Supabase, Redis, etc)
  → `infrastructure/`
- **Environment / config**
  → `config/`
- **Bootstrap-level controllers** (e.g. `/health`)
  → root of `src/` (they're not product features)

## Importing across modules

Modules talk to each other via their **public service** — exported
through the module's barrel (`index.ts`) and provided by the
`@Module({ exports: [...] })`. Never reach into another module's
internals.

If two modules need to share a type, that type probably belongs in
`@nook/shared` (the cross-app contract package), not in either
module.

## Adding a new module — checklist

- [ ] Create `modules/<feature>/<feature>.module.ts`
- [ ] Register it in `app.module.ts` under `imports`
- [ ] Co-locate `*.spec.ts` next to the file it tests
- [ ] Validate inputs with Zod via `@ZodBody` / `@ZodQuery` / `@ZodParam`
- [ ] If the module exposes services to others, export them from the
      `@Module` and re-export the public types from `index.ts`
