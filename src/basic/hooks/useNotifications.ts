import { useCallback, useState } from 'react';
import { Notification } from '../components/ui/toast/Toast.tsx';
import { OperationResult, ToastType } from '../../types.ts';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  }, []);

  const showNotifyFromResult = useCallback(
    (result: OperationResult) => {
      if (result.success) {
        addNotification(result.success.message, 'success');
      }

      if (result.error) {
        addNotification(result.error.message, 'error');
      }
    },
    [addNotification],
  );

  const hideNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return {
    notifications,
    addNotification,
    showNotifyFromResult,
    hideNotification,
  };
}
