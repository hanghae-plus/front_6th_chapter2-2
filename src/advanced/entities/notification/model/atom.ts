import { atom } from 'jotai';

import type { Notification, NotificationVariant } from '../consts';

export const notificationsAtom = atom<Notification[]>([]);

export const addNotificationAtom = atom(
  null,
  (get, set, message: string, variant: NotificationVariant = 'success') => {
    const id = Date.now().toString();
    const current = get(notificationsAtom);
    set(notificationsAtom, [...current, { id, message, variant }]);
  }
);

export const removeNotificationAtom = atom(null, (get, set, id: string) => {
  const current = get(notificationsAtom);
  set(
    notificationsAtom,
    current.filter((n) => n.id !== id)
  );
});
