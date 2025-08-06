import { atom } from 'jotai';
import { Notification } from '../types';
import { NOTIFICATION_DURATION } from '../constants/system';

// 통합된 알림 아톰 (상태 + 액션)
export const notificationsAtom = atom<Notification[]>([]); 

// 알림 추가 액션
export const addNotificationAtom = atom(
  null,
  (get, set, message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    const notifications = get(notificationsAtom);
    const newNotification: Notification = {
      id: `${Date.now()}-${Math.random()}`,
      message,
      type
    };
    
    set(notificationsAtom, [...notifications, newNotification]);
    
    // 3초 후 자동 제거
    setTimeout(() => {
      const current = get(notificationsAtom);
      set(notificationsAtom, current.filter(n => n.id !== newNotification.id));
    }, NOTIFICATION_DURATION);
  }
);

// 알림 제거 액션
export const removeNotificationAtom = atom(
  null,
  (get, set, notificationId: string) => {
    const notifications = get(notificationsAtom);
    set(notificationsAtom, notifications.filter(n => n.id !== notificationId));
  }
);