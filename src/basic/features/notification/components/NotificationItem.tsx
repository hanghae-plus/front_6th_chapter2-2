import CloseIcon from "../../../assets/icons/CloseIcon.svg?react";

interface NotificationItem {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}

interface NotificationItemProps {
  notification: NotificationItem;
  onRemove: (id: string) => void;
}

export function NotificationItem({
  notification,
  onRemove,
}: NotificationItemProps) {
  return (
    <div
      className={`p-4 rounded-md shadow-md text-white flex justify-between items-center ${
        notification.type === "error"
          ? "bg-red-600"
          : notification.type === "warning"
          ? "bg-yellow-600"
          : "bg-green-600"
      }`}
    >
      <span className="mr-2">{notification.message}</span>
      <button
        onClick={() => onRemove(notification.id)}
        className="text-white hover:text-gray-200"
      >
        <CloseIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
