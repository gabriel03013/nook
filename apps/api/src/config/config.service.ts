import { Injectable, Logger } from '@nestjs/common';

import { Env, envSchema } from './env.schema';

/**
 * Typed access to environment variables.
 *
 * Reads `process.env` once at construction time, runs it through the Zod
 * schema and freezes the result. Every getter below is fully typed —
 * no string magic like `config.get<string>('DATABASE_URL')`.
 *
 * If validation fails, the constructor throws and Nest aborts the boot.
 */
@Injectable()
export class ConfigService {
  private readonly logger = new Logger(ConfigService.name);
  private readonly env: Readonly<Env>;

  constructor() {
    const result = envSchema.safeParse(process.env);

    if (!result.success) {
      // Build a human-readable summary so the dev knows exactly what's missing.
      const issues = result.error.issues
        .map((issue) => {
          const path = issue.path.join('.') || '(root)';
          return `  - ${path}: ${issue.message}`;
        })
        .join('\n');

      this.logger.error(`Invalid environment configuration:\n${issues}`);
      throw new Error(
        `Environment validation failed. See errors above.\n` +
          `Tip: copy packages/database/.env.example as your starting point.`,
      );
    }

    this.env = Object.freeze(result.data);
    this.logger.log(`Environment loaded successfully (NODE_ENV=${this.env.NODE_ENV})`);
  }

  // ──────────────────────────────────────────────────────────────────────
  // Runtime
  // ──────────────────────────────────────────────────────────────────────

  get nodeEnv(): Env['NODE_ENV'] {
    return this.env.NODE_ENV;
  }

  get port(): number {
    return this.env.PORT;
  }

  get isProduction(): boolean {
    return this.env.NODE_ENV === 'production';
  }

  get isDevelopment(): boolean {
    return this.env.NODE_ENV === 'development';
  }

  get isTest(): boolean {
    return this.env.NODE_ENV === 'test';
  }

  // ──────────────────────────────────────────────────────────────────────
  // Database
  // ──────────────────────────────────────────────────────────────────────

  get databaseUrl(): string {
    return this.env.DATABASE_URL;
  }

  get directUrl(): string | undefined {
    return this.env.DIRECT_URL;
  }
}
