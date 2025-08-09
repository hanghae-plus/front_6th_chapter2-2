import { createContext, useContext, ReactNode } from 'react';
import { useNotifications as useNotificationsHook } from '@/shared/hooks';

interface NotificationContextType {
  notifications: Array<{ id: string; message: string; type: 'error' | 'success' | 'warning' }>;
  addNotification: (message: string, type: 'error' | 'success' | 'warning') => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const notificationLogic = useNotificationsHook();

  return (
    <NotificationContext.Provider value={notificationLogic}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
