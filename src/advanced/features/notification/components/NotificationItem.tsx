import { Notification } from "@/advanced/features/notification/types/notification";
import Icon from "@/advanced/shared/components/icons/Icon";
import { NOTIFICATION } from "@/advanced/shared/constants/notification";

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
        <Icon type="close" size={4} color="text-white" />
      </button>
    </div>
  );
}
