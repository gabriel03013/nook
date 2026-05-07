import { ArgumentsHost, BadRequestException } from '@nestjs/common';

import { ZodExceptionFilter } from './zod-exception.filter';

describe('ZodExceptionFilter', () => {
  let filter: ZodExceptionFilter;
  let mockResponse: { status: jest.Mock; json: jest.Mock };
  let mockRequest: { url: string; method: string };
  let mockHost: ArgumentsHost;

  beforeEach(() => {
    filter = new ZodExceptionFilter();

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockRequest = { url: '/api/v1/echo', method: 'POST' };

    mockHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as unknown as ArgumentsHost;
  });

  it('formats Zod-shaped exceptions into the structured response', () => {
    const exception = new BadRequestException({
      message: 'Validation failed',
      cause: [
        { path: 'name', message: 'name cannot be empty', code: 'too_small' },
        { path: 'age', message: 'expected number >= 0', code: 'too_small' },
      ],
    });

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    const body = mockResponse.json.mock.calls[0]?.[0] as Record<string, unknown>;

    expect(body.statusCode).toBe(400);
    expect(body.error).toBe('Validation Failed');
    expect(body.message).toBe('The request body did not match the expected schema.');
    expect(body.details).toHaveLength(2);
    expect(body.path).toBe('/api/v1/echo');
    expect(body.timestamp).toEqual(expect.any(String));
  });

  it('passes non-Zod BadRequestException through unchanged', () => {
    // A regular BadRequestException without our `cause` array — should fall
    // back to Nest's default response shape.
    const exception = new BadRequestException('Something else failed');

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    const body = mockResponse.json.mock.calls[0]?.[0] as Record<string, unknown>;
    // Nest wraps a string message into { statusCode, error, message } —
    // we just pass that through, no `details` field added.
    expect(body.message).toBe('Something else failed');
    expect(body.details).toBeUndefined();
  });

  it('passes through when cause is present but malformed', () => {
    // cause exists but doesn't match our shape (missing `code` field) —
    // we should not pretend it's a Zod error.
    const exception = new BadRequestException({
      message: 'Validation failed',
      cause: [{ path: 'x', message: 'broken' }], // no `code`
    });

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    const body = mockResponse.json.mock.calls[0]?.[0] as Record<string, unknown>;
    // didn't hit the formatted path — `details` field shouldn't exist
    expect(body.details).toBeUndefined();
  });

  it('passes through when cause is not an array', () => {
    const exception = new BadRequestException({
      message: 'Validation failed',
      cause: 'not an array',
    });

    filter.catch(exception, mockHost);

    const body = mockResponse.json.mock.calls[0]?.[0] as Record<string, unknown>;
    expect(body.details).toBeUndefined();
  });
});
