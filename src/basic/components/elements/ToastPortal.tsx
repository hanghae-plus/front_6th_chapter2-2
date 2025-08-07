import { Dispatch, memo, SetStateAction, useCallback } from "react";
import { createPortal } from "react-dom";
import { Notification } from "../../types";
import { CloseIcon } from "./Icons";

const TOAST_STYLES = {
  error: "bg-red-600",
  warning: "bg-yellow-600",
  success: "bg-green-600",
} as const;

interface ToastPortalProps {
  notifications: Notification[];
  setNotifications: Dispatch<SetStateAction<Notification[]>>;
}

// 개별 토스트 아이템을 메모화
const ToastItem = memo(({ notification, onRemove }: { notification: Notification; onRemove: () => void }) => (
  <div className={`p-4 rounded-md shadow-md text-white flex justify-between items-center transition-all duration-300 ${TOAST_STYLES[notification.type] || TOAST_STYLES.success}`}>
    <span className="mr-2">{notification.message}</span>
    <button onClick={onRemove} className="text-white hover:text-gray-200 transition-colors">
      <CloseIcon />
    </button>
  </div>
));

ToastItem.displayName = "ToastItem";

// 토스트 포털을 메모화
const ToastPortal = memo(({ notifications, setNotifications }: ToastPortalProps) => {
  const handleRemoveNotification = useCallback(
    (id: string) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    },
    [setNotifications]
  );

  if (notifications.length === 0) return null;

  return createPortal(
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <ToastItem key={notification.id} notification={notification} onRemove={() => handleRemoveNotification(notification.id)} />
      ))}
    </div>,
    document.body
  );
});

ToastPortal.displayName = "ToastPortal";

export default ToastPortal;
