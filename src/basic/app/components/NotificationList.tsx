import { Notification, type NotificationItem } from "../../shared";

interface NotificationListProps {
  notifications: NotificationItem[];
  onRemove: (id: string) => void;
}

export function NotificationList({ notifications, onRemove }: NotificationListProps) {
  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed right-4 top-20 z-50 max-w-sm space-y-2">
      {notifications.map((notif) => (
        <Notification key={notif.id} {...notif} onRemove={onRemove} />
      ))}
    </div>
  );
}
