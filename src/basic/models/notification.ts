import { z } from 'zod';

export const notificationTypeSchema = z.enum(['error', 'success', 'warning']);

export const notificationSchema = z.object({
  id: z.string(),
  message: z.string(),
  type: notificationTypeSchema,
});

export type NotificationType = z.infer<typeof notificationTypeSchema>;
export type Notification = z.infer<typeof notificationSchema>;
