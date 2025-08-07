import { atom } from 'jotai';
import type { Notification } from '../types';
import { NOTIFICATION_DURATION } from '../constants/toast';

/**
 * 알림 목록을 관리하는 atom
 */
export const notificationsAtom = atom<Notification[]>([]);

/**
 * 알림 추가 액션 atom
 */
export const addNotificationAtom = atom(
  null,
  (get, set, { message, type = 'success' }: { message: string; type?: 'error' | 'success' | 'warning' }) => {
    const id = Date.now().toString();
    const newNotification: Notification = { id, message, type };

    set(notificationsAtom, (prev) => [...prev, newNotification]);

    setTimeout(() => {
      set(notificationsAtom, (prev) => prev.filter((n) => n.id !== id));
    }, NOTIFICATION_DURATION);
  },
);

/**
 * 알림 제거 액션 atom
 */
export const removeNotificationAtom = atom(null, (get, set, notificationId: string) => {
  set(notificationsAtom, (prev) => prev.filter((n) => n.id !== notificationId));
});
