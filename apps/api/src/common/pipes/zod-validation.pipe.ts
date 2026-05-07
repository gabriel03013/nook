import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ZodError, ZodType } from 'zod';

/**
 * Validates incoming request data against a Zod schema.
 *
 * Usage in a controller:
 *
 *   @Post()
 *   create(@Body(new ZodValidationPipe(createPostSchema)) dto: CreatePost) {
 *     // dto is fully typed and guaranteed valid here
 *   }
 *
 * Or — preferred — through the @ZodBody / @ZodQuery / @ZodParam decorators
 * defined in `decorators/zod.decorator.ts`, which save the boilerplate.
 *
 * If validation fails, throws BadRequestException with a structured
 * payload that the global ZodExceptionFilter formats into a consistent
 * error response.
 */
@Injectable()
export class ZodValidationPipe<T> implements PipeTransform<unknown, T> {
  constructor(private readonly schema: ZodType<T>) {}

  transform(value: unknown, _metadata: ArgumentMetadata): T {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      // We throw a structured error here. The ZodExceptionFilter picks
      // it up and turns the cause into the final HTTP response.
      throw new BadRequestException({
        message: 'Validation failed',
        cause: this.formatZodError(result.error),
      });
    }

    return result.data;
  }

  /**
   * Turns a ZodError into a flat list of `{ path, message, code }` items.
   * Easier to consume from a frontend than the nested ZodIssue tree.
   */
  private formatZodError(error: ZodError): {
    path: string;
    message: string;
    code: string;
  }[] {
    return error.issues.map((issue) => ({
      path: issue.path.join('.') || '(root)',
      message: issue.message,
      code: issue.code,
    }));
  }
}
