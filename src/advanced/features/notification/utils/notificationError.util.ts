import { NotificationType } from "@/advanced/features/notification/types/notification";
import { NOTIFICATION } from "@/advanced/shared/constants/notification";
import { NotificationError } from "@/advanced/shared/errors/NotificationError";

export const throwNotificationError: Record<
  NotificationType,
  (message: string) => never
> = {
  [NOTIFICATION.TYPES.ERROR]: (message: string): never => {
    throw new NotificationError(message, NOTIFICATION.TYPES.ERROR);
  },

  [NOTIFICATION.TYPES.SUCCESS]: (message: string): never => {
    throw new NotificationError(message, NOTIFICATION.TYPES.SUCCESS);
  },

  [NOTIFICATION.TYPES.WARNING]: (message: string): never => {
    throw new NotificationError(message, NOTIFICATION.TYPES.WARNING);
  },
} as const;
