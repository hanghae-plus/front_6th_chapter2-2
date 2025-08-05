import { atom } from 'jotai';
import { Notification } from '../../types';

export const notificationsAtom = atom<Notification[]>([]);

export const addNotificationAtom = atom(
  null,
  (_, set, { message, type }: { message: string; type: 'success' | 'error' | 'warning' }) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      message,
      type,
    };

    setTimeout(() => {
      set(notificationsAtom, (prev) => prev.filter((n) => n.id !== newNotification.id));
    }, 3000);
  },
);

export const removeNotificationAtom = atom(null, (_, set, notificationId: string) => {
  set(notificationsAtom, (prev) => prev.filter((n) => n.id !== notificationId));
});
