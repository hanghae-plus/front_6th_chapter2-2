import { atom } from 'jotai';
import { Notification } from '../../models/components/toast.types.ts';

type messageType = 'error' | 'success' | 'warning';
export const notificationsAtom = atom<Notification[]>([]);

// 🎯 알림 추가 액션 atom (자동 제거 포함)
export const addNotificationAtom = atom(
  null,
  (
    get,
    set,
    { message, type = 'success' }: { message: string; type: messageType }
  ) => {
    const id = Date.now().toString();
    const newNotification: Notification = { id, message, type };

    // 알림 추가
    const currentNotifications = get(notificationsAtom);
    set(notificationsAtom, [...currentNotifications, newNotification]);

    // 자동 제거 (duration 후)
    setTimeout(() => {
      set(notificationsAtom, prev => prev.filter(n => n.id !== id));
    }, 3000);
  }
);

// 🎯 알림 수동 제거 액션 atom
export const removeNotificationAtom = atom(null, (_get, set, id) => {
  set(notificationsAtom, prev => prev.filter(n => n.id !== id));
});
