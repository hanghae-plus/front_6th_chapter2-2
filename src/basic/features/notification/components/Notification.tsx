import { NotificationItem } from "./NotificationItem";

interface Notification {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}

interface NotificationProps {
  notifications: Notification[];
  onRemoveNotification: (id: string) => void;
}

export function Notification({
  notifications,
  onRemoveNotification,
}: NotificationProps) {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={onRemoveNotification}
        />
      ))}
    </div>
  );
}
