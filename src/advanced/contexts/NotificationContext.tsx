import React, { createContext, useContext, ReactNode } from "react";
import { useNotifications } from "../hooks/useNotifications";

interface NotificationContextType {
  notifications: any[];
  addNotification: (
    message: string,
    type?: "success" | "error" | "warning"
  ) => void;
  removeNotification: (id: string) => void;
}

// 테스트 환경에서 사용할 알림 상태
let testNotifications: any[] = [];

const NotificationContext = createContext<NotificationContextType>({
  notifications: testNotifications,
  addNotification: (
    message: string,
    type?: "success" | "error" | "warning"
  ) => {
    // 테스트 환경에서 실제로 알림 추가
    const notification = {
      id: Date.now().toString(),
      message,
      type: type || "success",
    };
    testNotifications.push(notification);

    // 3초 후 자동 제거
    setTimeout(() => {
      testNotifications = testNotifications.filter(
        (n) => n.id !== notification.id
      );
    }, 3000);
  },
  removeNotification: (id: string) => {
    testNotifications = testNotifications.filter((n) => n.id !== id);
  },
});

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const { notifications, addNotification, removeNotification } =
    useNotifications();

  const value = {
    notifications,
    addNotification,
    removeNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
