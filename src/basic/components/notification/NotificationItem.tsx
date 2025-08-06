import { NOTIFICATION } from "@/basic/constants";
import { Notification } from "@/types";

interface Props {
  notification: Notification;
  removeNotification: (id: string) => void;
}

const NOTIFICATION_STYLES = {
  [NOTIFICATION.TYPES.ERROR]: "bg-red-600",
  [NOTIFICATION.TYPES.WARNING]: "bg-yellow-600",
  [NOTIFICATION.TYPES.SUCCESS]: "bg-green-600",
};

export default function NotificationItem({
  notification,
  removeNotification,
}: Props) {
  const { id, message, type } = notification;

  const handleClickClose = () => removeNotification(id);

  return (
    <div
      key={id}
      className={`p-4 rounded-md shadow-md text-white flex justify-between items-center ${NOTIFICATION_STYLES[type]}`}
    >
      <span className="mr-2">{message}</span>
      <button
        onClick={handleClickClose}
        className="text-white hover:text-gray-200"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
