export type NotificationVariant = 'error' | 'success' | 'warning';

export interface Notification {
  id: string;
  message: string;
  variant: NotificationVariant;
}
