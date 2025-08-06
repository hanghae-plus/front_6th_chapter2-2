import { NotificationType } from "@/types";

export class NotificationError extends Error {
  type: NotificationType;
  duration?: number;

  constructor(message: string, type: NotificationType, duration?: number) {
    super(message);
    this.name = "NotificationError";
    this.type = type;
    this.duration = duration;
  }
}

export type NotificationErrorData = Pick<
  NotificationError,
  "message" | "type" | "duration"
>;

export const isNotificationError = (
  error: unknown
): error is NotificationError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === "NotificationError" &&
    "type" in error &&
    "message" in error
  );
};

export const extractNotificationData = (
  error: NotificationError
): NotificationErrorData => {
  return {
    message: error.message,
    type: error.type,
    duration: error.duration,
  };
};

const notificationModel = {
  isNotificationError,
  extractNotificationData,
};

export default notificationModel;
