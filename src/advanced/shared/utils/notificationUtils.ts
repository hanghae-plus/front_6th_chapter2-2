import { useCallback } from 'react';
import { useSetAtom } from 'jotai';
import { notificationsAtom } from '../store';

let idCounter = 0;

const generateUniqueId = () => {
  return `notification-${Date.now()}-${++idCounter}`;
};

export const useNotification = () => {
  const setNotifications = useSetAtom(notificationsAtom);
  
  const addNotification = useCallback((message: string, type: 'error' | 'success' | 'warning' = 'success') => {
    const id = generateUniqueId();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  }, [setNotifications]);

  return { addNotification };
};