import NotificationItem from "./NotificationItem";
import { useNotification } from "../../hooks/useNotification";

const NotificationList = () => {
  const { notifications } = useNotification();

  return (
    <>
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
          {notifications.map((notif) => (
            // 토스트 모달 컴포넌트
            <NotificationItem
              key={notif.id}
              notification={notif}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default NotificationList;
