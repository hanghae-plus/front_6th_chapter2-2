import { NOTIFICATION } from "@/basic/shared/constants/notification";

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

export type NotificationType =
  (typeof NOTIFICATION.TYPES)[keyof typeof NOTIFICATION.TYPES];
