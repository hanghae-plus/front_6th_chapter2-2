import { atom } from 'jotai';

import { Notification } from '../types';

// 알림 목록 상태
export const notificationsAtom = atom<Notification[]>([]);

// 알림 추가 액션 (쓰기 전용 atom)
export const addNotificationAtom = atom(
  null,
  (get, set, { message, type = 'success' }: { message: string; type?: Notification['type'] }) => {
    const id = Date.now().toString();
    const newNotification: Notification = { id, message, type };

    // 새 알림을 기존 목록에 추가
    const currentNotifications = get(notificationsAtom);
    set(notificationsAtom, [...currentNotifications, newNotification]);

    // 3초 후 자동 제거
    setTimeout(() => {
      const notifications = get(notificationsAtom);
      set(
        notificationsAtom,
        notifications.filter((n) => n.id !== id),
      );
    }, 3000);
  },
);

// 알림 제거 액션 (쓰기 전용 atom)
export const removeNotificationAtom = atom(null, (get, set, id: string) => {
  const currentNotifications = get(notificationsAtom);
  set(
    notificationsAtom,
    currentNotifications.filter((n) => n.id !== id),
  );
});
