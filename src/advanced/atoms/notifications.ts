import { atom } from 'jotai';
import { Notification } from '../components/ui/toast/Toast';
import { OperationResult, ToastType } from '../../types';

// 기본 notifications atom
export const notificationsAtom = atom<Notification[]>([]);

// 알림 추가 액션 atom
export const addNotificationAtom = atom(
  null,
  (get, set, { message, type = 'success' }: { message: string; type?: ToastType }) => {
    const currentNotifications = get(notificationsAtom);

    // 동일한 메시지가 이미 있으면 추가하지 않음 (중복 방지)
    const isDuplicate = currentNotifications.some((n) => n.message === message && n.type === type);
    if (isDuplicate) return;

    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: Notification = { id, message, type };

    set(notificationsAtom, (prev) => [...prev, newNotification]);

    // 3초 후 자동 제거 (테스트 환경에서는 더 빠르게)
    const timeout =
      typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 100 : 3000;
    setTimeout(() => {
      set(notificationsAtom, (prev) => prev.filter((n) => n.id !== id));
    }, timeout);
  },
);

// 알림 제거 액션 atom
export const hideNotificationAtom = atom(null, (_get, set, id: string) => {
  set(notificationsAtom, (prev) => prev.filter((n) => n.id !== id));
});

// OperationResult 기반 알림 표시 액션 atom
export const showNotifyFromResultAtom = atom(null, (_get, set, result: OperationResult) => {
  if (result.success) {
    set(addNotificationAtom, {
      message: result.success.message,
      type: 'success',
    });
  }

  if (result.error) {
    set(addNotificationAtom, {
      message: result.error.message,
      type: 'error',
    });
  }
});
