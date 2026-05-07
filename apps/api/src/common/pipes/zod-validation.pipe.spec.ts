import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';

import { ZodValidationPipe } from './zod-validation.pipe';

describe('ZodValidationPipe', () => {
  const userSchema = z.object({
    name: z.string().min(1),
    age: z.number().int().min(0),
  });

  const pipe = new ZodValidationPipe(userSchema);

  describe('valid input', () => {
    it('returns parsed data when input matches the schema', () => {
      const input = { name: 'gabriel', age: 16 };
      const result = pipe.transform(input, {} as never);
      expect(result).toEqual(input);
    });

    it('strips unknown keys when schema does not allow them', () => {
      // Default Zod behavior: extra keys are ignored, not preserved.
      const input = { name: 'gabriel', age: 16, extra: 'ignored' };
      const result = pipe.transform(input, {} as never);
      expect(result).toEqual({ name: 'gabriel', age: 16 });
    });
  });

  describe('invalid input', () => {
    it('throws BadRequestException when a required field is missing', () => {
      expect(() => pipe.transform({ name: 'gabriel' }, {} as never)).toThrow(
        BadRequestException,
      );
    });

    it('includes a structured cause with path/message/code', () => {
      try {
        pipe.transform({ name: '', age: -1 }, {} as never);
        fail('should have thrown');
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
        const response = (err as BadRequestException).getResponse() as {
          message: string;
          cause: { path: string; message: string; code: string }[];
        };

        expect(response.message).toBe('Validation failed');
        expect(response.cause).toHaveLength(2);

        const paths = response.cause.map((c) => c.path);
        expect(paths).toContain('name');
        expect(paths).toContain('age');

        // every entry must carry path, message and code
        for (const issue of response.cause) {
          expect(issue.path).toEqual(expect.any(String));
          expect(issue.message).toEqual(expect.any(String));
          expect(issue.code).toEqual(expect.any(String));
        }
      }
    });

    it('formats nested paths with dot notation', () => {
      const nestedSchema = z.object({
        user: z.object({
          tags: z.array(z.string()).min(1),
        }),
      });
      const nestedPipe = new ZodValidationPipe(nestedSchema);

      try {
        nestedPipe.transform({ user: { tags: [] } }, {} as never);
        fail('should have thrown');
      } catch (err) {
        const response = (err as BadRequestException).getResponse() as {
          cause: { path: string }[];
        };
        expect(response.cause[0]?.path).toBe('user.tags');
      }
    });

    it('uses (root) when the error is at the top level', () => {
      const stringPipe = new ZodValidationPipe(z.string());

      try {
        stringPipe.transform(42, {} as never);
        fail('should have thrown');
      } catch (err) {
        const response = (err as BadRequestException).getResponse() as {
          cause: { path: string }[];
        };
        expect(response.cause[0]?.path).toBe('(root)');
      }
    });
  });
});
