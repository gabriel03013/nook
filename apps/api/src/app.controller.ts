import { Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { z } from 'zod';

import { AppService } from './app.service';
import { ZodBody } from './common';

// Tiny schema used only by the /echo endpoint below.
// Intentionally kept here (not in @nook/shared) because it has no
// product meaning — it exists to validate that the Zod pipe is wired
// correctly end-to-end.
const echoSchema = z.object({
  name: z.string().min(1, 'name cannot be empty').max(50),
  age: z.number().int().min(0).max(150),
  tags: z.array(z.string().min(1)).max(10).optional(),
});
type EchoInput = z.infer<typeof echoSchema>;

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  health(): { status: string; timestamp: string } {
    return this.appService.getHealth();
  }

  /**
   * Smoke test for the Zod validation pipeline.
   *
   * Try:
   *   POST /api/v1/echo  { "name": "gabriel", "age": 16 }
   *   → 200 { received: { name: "gabriel", age: 16 } }
   *
   *   POST /api/v1/echo  { "name": "", "age": -1 }
   *   → 400 with structured details from ZodExceptionFilter
   *
   * This endpoint will be removed once a real domain controller exists.
   */
  @Post('echo')
  @HttpCode(HttpStatus.OK)
  echo(@ZodBody(echoSchema) input: EchoInput): { received: EchoInput } {
    return { received: input };
  }
}
