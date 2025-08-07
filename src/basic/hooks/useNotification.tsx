import { useState, useCallback, createContext, useContext, ReactNode, useMemo } from "react";
import { Notification } from "../types";
import ToastPortal from "../components/elements/ToastPortal";

/** 토스트 지속 시간 */
const TOAST_DURATION_MS = 3000;
/** 알림 스타일 */
export const TOAST_STYLES = {
  error: "bg-red-600",
  warning: "bg-yellow-600",
  success: "bg-green-600",
} as const;

/** 알림 타입 */
type TNotificationType = "error" | "success" | "warning";

// Context 타입
interface NotificationContextType {
  showToast: (message: string, type?: TNotificationType) => void;
}

// Context 생성
export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Provider
export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showToast = useCallback((message: string, type: TNotificationType = "success") => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, TOAST_DURATION_MS);
  }, []);

  const contextValue = useMemo(
    () => ({
      showToast,
    }),
    [showToast]
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <ToastPortal notifications={notifications} setNotifications={setNotifications} />
    </NotificationContext.Provider>
  );
};

// Context hook
export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("Provider 컴포넌트 내에서 사용해야 합니다.");
  }

  return context;
};
