export type NotificationType = "error" | "success" | "warning";

export interface NotificationItem {
  id: string;
  message: string;
  type: NotificationType;
}

export type NotificationFunction = (message: string, type?: NotificationType) => void;
