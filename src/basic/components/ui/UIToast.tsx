import { CloseIcon } from "../icons";
import { Notification } from "../../hooks/useNotifications";

interface UIToastProps {
  notification: Notification;
  onClose: (id: string) => void;
}

export const UIToast = ({ notification, onClose }: UIToastProps) => {
  const getBackgroundColor = (type: Notification["type"]): string => {
    switch (type) {
      case "error":
        return "bg-red-600";
      case "warning":
        return "bg-yellow-600";
      case "success":
      default:
        return "bg-green-600";
    }
  };

  return (
    <div
      className={`p-4 rounded-md shadow-md text-white flex justify-between items-center ${getBackgroundColor(
        notification.type
      )}`}
    >
      <span className="mr-2">{notification.message}</span>
      <button
        onClick={() => onClose(notification.id)}
        className="text-white hover:text-gray-200"
      >
        <CloseIcon className="w-4 h-4" />
      </button>
    </div>
  );
};
