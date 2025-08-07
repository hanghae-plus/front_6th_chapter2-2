import type { Notification } from "../types";

interface NotificationListProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

export function NotificationList({ notifications, onRemove }: NotificationListProps) {
  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed right-4 top-20 z-50 max-w-sm space-y-2">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`flex items-center justify-between rounded-md p-4 text-white shadow-md ${
            notif.type === "error"
              ? "bg-red-600"
              : notif.type === "warning"
                ? "bg-yellow-600"
                : "bg-green-600"
          }`}
        >
          <span className="mr-2">{notif.message}</span>
          <button onClick={() => onRemove(notif.id)} className="text-white hover:text-gray-200">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
