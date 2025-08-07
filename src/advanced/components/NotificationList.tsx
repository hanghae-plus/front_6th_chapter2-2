import { UIToast } from "./ui/UIToast";
import { useNotifications } from "../hooks/useNotifications";

export function NotificationList() {
  const { notifications, removeNotification } = useNotifications();
  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <UIToast
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  );
}
