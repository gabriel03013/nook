import { z } from 'zod';
import { CommentResponseType, ContentStatus } from '../enums';

// Input shape for POST /posts/:postId/comments.
export const CreateCommentInput = z.object({
  content: z
    .string()
    .min(1, 'content cannot be empty')
    .max(2000, 'content can be at most 2000 characters'),
  responseType: CommentResponseType,
  anonymous: z.boolean().default(false),
});
export type CreateCommentInput = z.infer<typeof CreateCommentInput>;

export const UpdateCommentInput = z.object({
  content: z
    .string()
    .min(1)
    .max(2000)
    .optional(),
  status: ContentStatus.exclude(['REMOVED', 'HIDDEN', 'DELETED']).optional(),
});
export type UpdateCommentInput = z.infer<typeof UpdateCommentInput>;
