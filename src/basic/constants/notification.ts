export const NOTIFICATION_TIMEOUT_MS = 3000;

export const NOTIFICATION_TYPES = {
  ERROR: "error",
  SUCCESS: "success",
  WARNING: "warning",
} as const;

export type NotificationType =
  (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];
