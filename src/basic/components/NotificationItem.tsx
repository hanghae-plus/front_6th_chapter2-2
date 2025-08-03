import { INotification } from "../type";
import { CloseIcon } from "./icon";

interface NotificationItemProps {
  notification: INotification;
  setNotifications: React.Dispatch<React.SetStateAction<INotification[]>>;
}

const NotificationItem = ({
  notification,
  setNotifications,
}: NotificationItemProps) => {
  return (
    <div
      key={notification.id}
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
        onClick={() =>
          setNotifications((prev) =>
            prev.filter((n) => n.id !== notification.id)
          )
        }
        className="text-white hover:text-gray-200"
      >
        {/* 토스트 모달 x 아이콘 */}
        <CloseIcon />
      </button>
    </div>
  );
};

export default NotificationItem;
