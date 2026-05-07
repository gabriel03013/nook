import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

interface ZodValidationCause {
  path: string;
  message: string;
  code: string;
}

interface ValidationFailedResponse {
  statusCode: number;
  error: string;
  message: string;
  details: ZodValidationCause[];
  timestamp: string;
  path: string;
}

/**
 * Catches BadRequestException raised by ZodValidationPipe and shapes
 * the response body into a consistent contract:
 *
 *   {
 *     "statusCode": 400,
 *     "error": "Validation Failed",
 *     "message": "The request body did not match the expected schema.",
 *     "details": [
 *       { "path": "title", "message": "Required", "code": "invalid_type" }
 *     ],
 *     "timestamp": "2026-05-05T18:42:13.123Z",
 *     "path": "/api/v1/posts"
 *   }
 *
 * Other BadRequestExceptions (from elsewhere in the app) pass through
 * unchanged via Nest's default handling.
 */
@Catch(BadRequestException)
export class ZodExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ZodExceptionFilter.name);

  catch(exception: BadRequestException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<{ url: string; method: string }>();

    const exceptionResponse = exception.getResponse();
    const cause = this.extractZodCause(exceptionResponse);

    // Not a Zod-shaped exception — re-throw to fall back to the default Nest handler.
    if (!cause) {
      response.status(exception.getStatus()).json(exceptionResponse);
      return;
    }

    const body: ValidationFailedResponse = {
      statusCode: HttpStatus.BAD_REQUEST,
      error: 'Validation Failed',
      message: 'The request body did not match the expected schema.',
      details: cause,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    this.logger.debug(
      `[${request.method} ${request.url}] validation failed: ${JSON.stringify(cause)}`,
    );

    response.status(HttpStatus.BAD_REQUEST).json(body);
  }

  /**
   * Tries to read the `cause` array we set inside ZodValidationPipe.
   * Returns null when the exception came from somewhere else and
   * doesn't follow this shape.
   */
  private extractZodCause(exceptionResponse: unknown): ZodValidationCause[] | null {
    if (
      typeof exceptionResponse !== 'object' ||
      exceptionResponse === null ||
      !('cause' in exceptionResponse)
    ) {
      return null;
    }

    const cause = exceptionResponse.cause;
    if (!Array.isArray(cause)) {
      return null;
    }

    // Light shape check — every item must look like ZodValidationCause.
    const isValid = cause.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as ZodValidationCause).path === 'string' &&
        typeof (item as ZodValidationCause).message === 'string' &&
        typeof (item as ZodValidationCause).code === 'string',
    );

    return isValid ? (cause as ZodValidationCause[]) : null;
  }
}
