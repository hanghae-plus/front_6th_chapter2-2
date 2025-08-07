import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { notificationsAtom } from '../atoms/notificationAtoms';

/**
 * 알림(Notification) 상태를 관리하는 커스텀 Hook (Jotai 버전)
 *
 * @returns { notifications, addNotification, removeNotification }
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useAtom(notificationsAtom);

  const addNotification = useCallback(
    (message: string, type: 'error' | 'success' | 'warning' = 'success') => {
      const id = Date.now();

      // 알림 추가
      setNotifications(prev => [...prev, { id, message, type }]);

      // 3초 후 자동 제거
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 3000);
    },
    [setNotifications]
  );

  const removeNotification = useCallback(
    (id: number) => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    },
    [setNotifications]
  );

  return {
    notifications,
    addNotification,
    removeNotification,
  };
};
