import { NotificationItem } from "./NotificationItem";
import { type NotificationType } from "@entities/notification";

interface NotificationListProps {
  notifications: NotificationType[];
  onRemoveNotification: (id: string) => void;
}

export function NotificationList({
  notifications,
  onRemoveNotification,
}: NotificationListProps) {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          id={notification.id}
          message={notification.message}
          variant={notification.variant}
          onRemove={onRemoveNotification}
        />
      ))}
    </div>
  );
}
