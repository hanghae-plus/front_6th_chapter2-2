import { atom } from 'jotai';

export const notificationAtom = atom<{
  message: string;
  type: 'error' | 'success' | 'warning';
} | null>(null);

export const addNotificationAtom = atom(
  null,
  (_get, set, message: string, type: 'error' | 'success' | 'warning') => {
    set(notificationAtom, { message, type });
    setTimeout(() => {
      set(notificationAtom, null);
    }, 3000);
  }
);
