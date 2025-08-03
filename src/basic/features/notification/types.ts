export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

export enum NotificationType {
  ERROR = "error",
  SUCCESS = "success",
  WARNING = "warning",
}
