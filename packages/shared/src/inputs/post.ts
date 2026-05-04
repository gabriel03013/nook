import { z } from 'zod';
import { PostIntent, ContentStatus } from '../enums';

// Input shape for POST /posts.
// User-authored vent, with explicit intent (advice/listen/etc).
export const CreatePostInput = z.object({
  content: z
    .string()
    .min(1, 'content cannot be empty')
    .max(4000, 'content can be at most 4000 characters'),
  topic: z
    .string()
    .max(60, 'topic can be at most 60 characters')
    .optional(),
  intent: PostIntent,
  emotionalIntensity: z
    .number()
    .int()
    .min(1)
    .max(10)
    .optional(),
  allowAdvice: z.boolean().default(false),
  anonymous: z.boolean().default(false),
});
export type CreatePostInput = z.infer<typeof CreatePostInput>;

// Input shape for PATCH /posts/:id.
// Limited subset — author cannot change authorship or set
// moderation statuses (HIDDEN/REMOVED).
export const UpdatePostInput = z.object({
  content: z
    .string()
    .min(1)
    .max(4000)
    .optional(),
  topic: z.string().max(60).nullable().optional(),
  allowAdvice: z.boolean().optional(),
  // Author can soft-delete by setting deletedAt.
  // Author CANNOT set status to REMOVED/HIDDEN — that is moderator-only.
  status: ContentStatus.exclude(['REMOVED', 'HIDDEN', 'DELETED']).optional(),
});
export type UpdatePostInput = z.infer<typeof UpdatePostInput>;
