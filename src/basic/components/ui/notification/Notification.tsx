import { Notification } from "../../../hooks/useNotifications";
import { CloseIcon } from "../../icons";

interface NotificationProps {
  notifications: Notification[];
  onRemoveNotification: (id: string) => void;
}

export const NotificationComponent = ({
  notifications,
  onRemoveNotification,
}: NotificationProps) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-center justify-between p-4 rounded-lg shadow-lg ${
            notification.type === "error"
              ? "bg-red-100 text-red-800 border border-red-200"
              : notification.type === "warning"
              ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
              : "bg-green-100 text-green-800 border border-green-200"
          }`}
        >
          <span className="text-sm font-medium">{notification.message}</span>
          <button
            onClick={() => onRemoveNotification(notification.id)}
            className="ml-3 text-gray-400 hover:text-gray-600"
          >
            <CloseIcon />
          </button>
        </div>
      ))}
    </div>
  );
};
