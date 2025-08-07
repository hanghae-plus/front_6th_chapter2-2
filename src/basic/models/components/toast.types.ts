export interface NotificationHandler {
  (message: string, type?: NotificationType): void;
}

export type NotificationType = 'error' | 'success' | 'warning';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}
