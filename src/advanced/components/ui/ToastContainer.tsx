import { UIToast } from "./UIToast";
import { Notification } from "../../atoms/appAtoms";

interface ToastContainerProps {
  notifications: Notification[];
  onRemoveNotification: (id: string) => void;
}

export const ToastContainer = ({
  notifications,
  onRemoveNotification,
}: ToastContainerProps) => {
  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <UIToast
          key={notification.id}
          notification={notification}
          onClose={onRemoveNotification}
        />
      ))}
    </div>
  );
};
