import { atom } from 'jotai';
import { Notification } from '../../types';

export const notificationsAtom = atom<Notification[]>([]);

export const addNotificationAtom = atom(
  null,
  (_, set, { message, type }: { message: string; type: 'success' | 'error' | 'warning' }) => {
    const newNotification: Notification = {
      id: Date.now().toString() + Math.random(),
      message,
      type,
    };
    set(notificationsAtom, (prev) => [...prev, newNotification]);
  },
);

export const removeNotificationAtom = atom(null, (_, set, notificationId: string) => {
  set(notificationsAtom, (prev) => prev.filter((n) => n.id !== notificationId));
});
