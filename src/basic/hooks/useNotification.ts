import { useState } from 'react';

type Notification = {
  id: string;
  message: string;
  type: 'error' | 'success' | 'warning';
};

export function useNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (message: string, type: 'error' | 'success' | 'warning' = 'success') => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  return {
    notifications,
    addNotification,
  };
}

export default useNotification;
