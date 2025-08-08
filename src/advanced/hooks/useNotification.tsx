import {
  useState,
  useCallback,
  createContext,
  PropsWithChildren,
  useMemo,
  useContext,
  memo,
} from "react";
import { CloseXIcon } from "../components/icons";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

const NOTIFICATION_TIMEOUT = 3000;

export interface NotificationContextActionsTypes {
  addNotification: (message: string, type: NotificationType) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<Notification[]>([]);
const NotificationContextActions =
  createContext<NotificationContextActionsTypes>({
    addNotification: () => {},
    removeNotification: () => {},
  });

export const NotificationProvider = memo(({ children }: PropsWithChildren) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (message: string, type: NotificationType = "success") => {
      const id = Date.now().toString();

      setNotifications((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, NOTIFICATION_TIMEOUT);
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const actions = useMemo(
    () => ({
      addNotification,
      removeNotification,
    }),
    [addNotification, removeNotification]
  );

  return (
    <NotificationContext.Provider value={notifications}>
      <NotificationContextActions.Provider value={actions}>
        {notifications.length > 0 && (
          <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 rounded-md shadow-md text-white flex justify-between items-center ${
                  notif.type === "error"
                    ? "bg-red-600"
                    : notif.type === "warning"
                    ? "bg-yellow-600"
                    : "bg-green-600"
                }`}
              >
                <span className="mr-2">{notif.message}</span>
                <button
                  onClick={() => removeNotification(notif.id)}
                  className="text-white hover:text-gray-200"
                >
                  <CloseXIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        {children}
      </NotificationContextActions.Provider>
    </NotificationContext.Provider>
  );
});

export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("NotificationContext is not found");
  }

  return context;
};

export const useNotificationActions = () => {
  const context = useContext(NotificationContextActions);

  if (!context) {
    throw new Error("NotificationContextActions is not found");
  }

  return context;
};
