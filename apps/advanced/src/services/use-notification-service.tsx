import {
  Notification,
  NotificationType,
  notificationTypeSchema
} from '@/models/notification';
import { proxy, useSnapshot } from 'valtio';

const state = proxy<{ notifications: Notification[] }>({ notifications: [] });

// 알림 타이머를 저장하는 Map
const notificationTimers = new Map<string, NodeJS.Timeout>();

export const useNotificationService = () => {
  const { notifications } = useSnapshot(state);

  const removeNotification = (id: string) => {
    // 기존 타이머가 있다면 제거
    const existingTimer = notificationTimers.get(id);
    if (existingTimer) {
      clearTimeout(existingTimer);
      notificationTimers.delete(id);
    }

    state.notifications = state.notifications.filter(
      notification => notification.id !== id
    );
  };

  const addNotification = (
    message: string,
    type: NotificationType = notificationTypeSchema.enum.success
  ) => {
    // 동일한 메시지의 알림이 이미 존재하는지 확인
    const existingNotification = state.notifications.find(
      notification => notification.message === message
    );

    if (existingNotification) {
      // 기존 알림의 타이머를 리셋
      removeNotification(existingNotification.id);
    }

    const id = Date.now().toString();
    state.notifications.push({ id, message, type });

    // 새로운 타이머 설정
    const timer = setTimeout(() => {
      removeNotification(id);
    }, 3000);
    notificationTimers.set(id, timer);
  };

  return { notifications, addNotification, removeNotification };
};
