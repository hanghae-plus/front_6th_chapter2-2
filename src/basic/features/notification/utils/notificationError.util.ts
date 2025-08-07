import { NotificationType } from "@/basic/features/notification/types/notification";
import { NOTIFICATION } from "@/basic/shared/constants/notification";
import { NotificationError } from "@/basic/shared/errors/NotificationError";

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
