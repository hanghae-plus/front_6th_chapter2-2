import type { Notification } from '../../types';

interface AddNotificationParams {
  notifications: Notification[];
  id: string;
  message: string;
  type?: 'error' | 'success' | 'warning';
}

// 알림 추가
export function addNotification({
  notifications,
  id,
  message,
  type = 'success',
}: AddNotificationParams) {
  return [...notifications, { id, message, type }];
}

interface RemoveNotificationParams {
  notifications: Notification[];
  id: string;
}

export function removeNotification({
  notifications,
  id,
}: RemoveNotificationParams) {
  return notifications.filter((n) => n.id !== id);
}
