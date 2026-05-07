// Public API of @nook/database.
//
// Re-exports the Prisma Client and all generated types so consumers
// (apps/api, apps/web) import from `@nook/database` instead of
// `@prisma/client`. This keeps the database boundary explicit:
// if we ever swap Prisma for something else, only this file changes.

export * from '@prisma/client';
