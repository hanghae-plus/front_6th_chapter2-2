import { atom } from 'jotai';

export interface Notification {
  id: number;
  message: string;
  type: 'error' | 'success' | 'warning';
}

export const notificationsAtom = atom<Notification[]>([]);
