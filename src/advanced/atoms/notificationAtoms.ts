import { atom } from 'jotai';
import { NotificationType } from '../types/notification';

// 알림 목록
export const notificationsAtom = atom<NotificationType[]>([]);
