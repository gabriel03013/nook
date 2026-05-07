import { Body, Param, Query } from '@nestjs/common';
import { ZodType } from 'zod';

import { ZodValidationPipe } from '../pipes/zod-validation.pipe';

/**
 * Validates and types the request body against a Zod schema.
 *
 *   @Post()
 *   create(@ZodBody(createPostSchema) dto: z.infer<typeof createPostSchema>) { ... }
 *
 * Equivalent to `@Body(new ZodValidationPipe(schema))` but reads better.
 */
export const ZodBody = <T>(schema: ZodType<T>): ParameterDecorator =>
  Body(new ZodValidationPipe(schema));

/**
 * Validates and types the request query string against a Zod schema.
 *
 *   @Get()
 *   list(@ZodQuery(listPostsQuery) q: z.infer<typeof listPostsQuery>) { ... }
 */
export const ZodQuery = <T>(schema: ZodType<T>): ParameterDecorator =>
  Query(new ZodValidationPipe(schema));

/**
 * Validates and types route params against a Zod schema.
 *
 *   @Get(':id')
 *   findOne(@ZodParam(postIdParam) p: { id: string }) { ... }
 */
export const ZodParam = <T>(schema: ZodType<T>): ParameterDecorator =>
  Param(new ZodValidationPipe(schema));
