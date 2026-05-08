import { z } from 'zod';

// Mirrors Postgres enums from packages/database (public schema).
// Keep these IN SYNC with schema.prisma — when adding a new enum
// value at DB level, add it here too.

export const UserStatus = z.enum([
  'ACTIVE',
  'SUSPENDED',
  'BANNED',
  'DELETED',
]);
export type UserStatus = z.infer<typeof UserStatus>;

export const Role = z.enum([
  'USER',
  'LISTENER',
  'FACILITATOR',
  'MODERATOR',
  'ADMIN',
]);
export type Role = z.infer<typeof Role>;

export const EmotionalState = z.enum([
  'CALM',
  'ANXIOUS',
  'SAD',
  'ANGRY',
  'LONELY',
  'OVERWHELMED',
  'NUMB',
  'UNSURE',
]);
export type EmotionalState = z.infer<typeof EmotionalState>;

export const NeedType = z.enum([
  'VENT',
  'BE_HEARD',
  'ADVICE',
  'DISTRACTION',
  'SILENT_COMPANY',
  'HELP_SOMEONE',
  'PRIVATE_WRITING',
  'READ_SUPPORT',
  'URGENT_SUPPORT',
]);
export type NeedType = z.infer<typeof NeedType>;

export const PostIntent = z.enum([
  'JUST_LISTEN',
  'ADVICE',
  'SIMILAR_STORIES',
  'DISTRACTION',
  'SUPPORT_NOW',
  'JUST_VENT',
]);
export type PostIntent = z.infer<typeof PostIntent>;

export const ContentStatus = z.enum([
  'DRAFT',
  'PUBLISHED',
  'PENDING_REVIEW',
  'HIDDEN',
  'REMOVED',
  'DELETED',
]);
export type ContentStatus = z.infer<typeof ContentStatus>;

export const CommentResponseType = z.enum([
  'VALIDATION',
  'QUESTION',
  'SHARED_EXPERIENCE',
  'DISTRACTION',
  'PRESENCE',
]);
export type CommentResponseType = z.infer<typeof CommentResponseType>;

export const ReactionType = z.enum([
  'READ_WITH_CARE',
  'WITH_YOU',
  'I_RELATE',
  'THANKS_FOR_SHARING',
  'HELPED_ME',
  'YOU_WERE_HEARD',
]);
export type ReactionType = z.infer<typeof ReactionType>;
