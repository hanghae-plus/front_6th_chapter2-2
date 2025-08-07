import { atom } from 'jotai';

export interface Notification {
  id: string;
  message: string;
  type: 'error' | 'success' | 'warning';
}

export const notificationsAtom = atom<Notification[]>([]);