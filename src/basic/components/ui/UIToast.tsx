import { Notification } from "../../type/types";
import { CloseIcon } from "../icons";

interface UIToastProps {
  notification: Notification;
  onRemove: (id: string) => void;
}

export function UIToast({ notification, onRemove }: UIToastProps) {
  const getBackgroundColor = (type: Notification["type"]) => {
    switch (type) {
      case "error":
        return "bg-red-600";
      case "warning":
        return "bg-yellow-600";
      default:
        return "bg-green-600";
    }
  };

  return (
    <div
      key={notification.id}
      className={`p-4 rounded-md shadow-md text-white flex justify-between items-center ${getBackgroundColor(
        notification.type
      )}`}
    >
      <span className="mr-2">{notification.message}</span>
      <button
        onClick={() => onRemove(notification.id)}
        className="text-white hover:text-gray-200"
      >
        <CloseIcon />
      </button>
    </div>
  );
}
