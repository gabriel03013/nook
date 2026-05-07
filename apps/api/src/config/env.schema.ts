import { z } from 'zod';

/**
 * Schema for environment variables expected by the API.
 *
 * Validated once at startup via `ConfigService.load()`. If anything is
 * missing or malformed, the application fails to boot — by design.
 *
 * The shape and the inferred type below are the single source of truth
 * for everything the app reads from `process.env`.
 */
export const envSchema = z.object({
  // ──────────────────────────────────────────────────────────────────────
  // Runtime
  // ──────────────────────────────────────────────────────────────────────
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3001),

  // ──────────────────────────────────────────────────────────────────────
  // Database
  // ──────────────────────────────────────────────────────────────────────
  // Pooled URL — used by the Prisma Client at runtime (Supabase pooler 6543)
  DATABASE_URL: z
    .string()
    .min(1, 'DATABASE_URL is required')
    .startsWith('postgres', 'DATABASE_URL must be a Postgres connection string'),

  // Direct URL — used by `prisma migrate` and other DDL operations (port 5432)
  // Optional in environments that don't run migrations from the API process.
  DIRECT_URL: z.string().startsWith('postgres').optional(),

  // ──────────────────────────────────────────────────────────────────────
  // Future fields will go here:
  //   SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
  //   REDIS_URL
  //   JWT_SECRET
  //   etc.
  // ──────────────────────────────────────────────────────────────────────
});

export type Env = z.infer<typeof envSchema>;
