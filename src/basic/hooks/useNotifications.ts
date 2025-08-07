import { useState, useCallback } from 'react';
import { Notification } from '../models/components/toast.types.ts';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const addNotification = useCallback(
    (message: string, type: 'error' | 'success' | 'warning' = 'success') => {
      const id = Date.now().toString();
      setNotifications(prev => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 1000);
    },
    []
  );
  const handleCloseToast = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  return { addNotification, notifications, handleCloseToast };
};
