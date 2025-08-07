import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { notificationsAtom } from '../atoms';
import { NotificationType } from '../types/notification';

export const useNotification = () => {
  const [notifications, setNotifications] = useAtom(notificationsAtom);

  const addNotification = useCallback(
    (message: string, type: 'error' | 'success' | 'warning' = 'success') => {
      const newNotification: NotificationType = {
        id: Date.now().toString(),
        message,
        type,
      };

      setNotifications((prev) => [...prev, newNotification]);

      // 3초 후 자동으로 제거
      setTimeout(() => {
        setNotifications((prev) =>
          prev.filter((notification) => notification.id !== newNotification.id)
        );
      }, 3000);
    },
    [setNotifications]
  );

  const removeNotification = useCallback(
    (id: string) => {
      setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    },
    [setNotifications]
  );

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, [setNotifications]);

  return {
    notifications,
    setNotifications,
    addNotification,
    removeNotification,
    clearNotifications,
  };
};
