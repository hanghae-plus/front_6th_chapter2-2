import { atom } from 'jotai';

import { Notification } from '../../types';

export const notificationsAtom = atom<Notification[]>([]);

export const addNotificationAtom = atom(
  null,
  (_, set, update: { message: string; type?: Notification['type'] }) => {
    const id = Date.now().toString();
    const newNotification: Notification = {
      id,
      message: update.message,
      type: update.type || 'success',
    };

    set(notificationsAtom, (prev) => [...prev, newNotification]);

    setTimeout(() => {
      set(notificationsAtom, (prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  },
);

export const isAdminAtom = atom(false);

export const searchTermAtom = atom('');
