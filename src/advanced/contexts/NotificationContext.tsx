import {
  createContext,
  PropsWithChildren,
  useContext,
  useCallback,
  useState,
} from "react";

import {
  Notification,
  createNotification,
  addNotification as _addNotification,
  removeNotification,
} from "../utils/notification";

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string, type?: Notification["type"]) => void;
  removeNotificationById: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children }: PropsWithChildren) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (message: string, type: Notification["type"] = "success") => {
      const notification = createNotification(message, type);
      setNotifications((prev) => _addNotification(prev, notification));

      setTimeout(() => {
        setNotifications((prev) => removeNotification(prev, notification.id));
      }, 3000);
    },
    []
  );

  const removeNotificationById = useCallback((notificationId: string) => {
    setNotifications((prev) => removeNotification(prev, notificationId));
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotificationById,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotificationContext must be used within a NotificationProvider"
    );
  }

  return context;
};
