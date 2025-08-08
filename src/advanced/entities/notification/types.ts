export interface NotificationType {
  id: string;
  message: string;
  variant: NotificationVariant;
}

export enum NotificationVariant {
  ERROR = "error",
  SUCCESS = "success",
  WARNING = "warning",
}
