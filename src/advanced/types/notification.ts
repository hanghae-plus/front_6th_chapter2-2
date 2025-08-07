export interface NotificationType {
  id: string;
  message: string;
  type: 'error' | 'success' | 'warning';
}
