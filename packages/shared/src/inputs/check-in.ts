import { z } from 'zod';
import { EmotionalState, NeedType } from '../enums';

// Input shape for POST /check-ins.
// User self-expression of current emotional state and need.
// IMPORTANT: not a clinical assessment — never frame it as such.
export const CreateCheckInInput = z.object({
  emotionalState: EmotionalState,
  needType: NeedType,
  intensity: z
    .number()
    .int('intensity must be an integer')
    .min(1, 'intensity must be between 1 and 10')
    .max(10, 'intensity must be between 1 and 10')
    .optional(),
  note: z
    .string()
    .max(500, 'note can be at most 500 characters')
    .optional(),
});
export type CreateCheckInInput = z.infer<typeof CreateCheckInInput>;
