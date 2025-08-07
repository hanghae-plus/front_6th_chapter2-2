import { atom } from 'jotai';
import { Notification } from '../../types';

export const notificationsAtom = atom<Array<Notification>>([]);

export const addNotificationAtom = atom(
  null,
  (_get, set, { message, type = 'success' }: { message: string; type?: 'error' | 'success' | 'warning' }) => {
    const id = Date.now().toString();
    const newNotification: Notification = { id, message, type };
    
    set(notificationsAtom, (prev) => [...prev, newNotification]);
    
    setTimeout(() => {
      set(notificationsAtom, (prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  }
);

export const removeNotificationAtom = atom(
  null,
  (_get, set, id: string) => {
    set(notificationsAtom, (prev) => prev.filter((n) => n.id !== id));
  }
);