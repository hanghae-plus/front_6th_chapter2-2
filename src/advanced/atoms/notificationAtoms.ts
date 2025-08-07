import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { Notification } from '../types';

// 알림 목록 상태 - localStorage와 동기화 (빈 배열로 기본값 설정)
export const notificationsAtom = atomWithStorage<Notification[]>('notifications', []);

// 알림 추가 액션 (쓰기 전용 atom)
export const addNotificationAtom = atom(
  null,
  (
    get,
    set,
    { id, message, type = 'success' }: { id: string; message: string; type?: Notification['type'] },
  ) => {
    const newNotification: Notification = { id, message, type };

    // 새 알림을 기존 목록에 추가
    const currentNotifications = get(notificationsAtom);
    set(notificationsAtom, [...currentNotifications, newNotification]);
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
