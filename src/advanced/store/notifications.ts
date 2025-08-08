import { atom } from 'jotai';

import type { Notification } from '../../types';

// Notification state
export const notificationsAtom = atom<Notification[]>([]);

// Notification helpers
export const pushNotificationAtom = atom(
  null,
  (_get, set, { message, type }: { message: string; type: 'error' | 'success' | 'warning' }) => {
    const id = Date.now().toString();
    set(notificationsAtom, (prev) => [...prev, { id, message, type }]);
  },
);

export const removeNotificationAtom = atom(null, (_get, set, id: string) => {
  set(notificationsAtom, (prev) => prev.filter((n) => n.id !== id));
});
