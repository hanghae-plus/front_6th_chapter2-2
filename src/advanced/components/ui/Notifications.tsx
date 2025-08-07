import { Notification } from './Notification';
import type { Notification as NotificationType } from '../../constants';

interface NotificationProps {
  notifications: NotificationType[];
  onRemoveNotification: (id: string) => void;
}

export function Notifications({ notifications, onRemoveNotification }: NotificationProps) {
  if (notifications.length === 0) return null;

  return (
    <div className='fixed top-20 right-4 z-50 space-y-2 max-w-sm'>
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
          onRemoveNotification={onRemoveNotification}
        />
      ))}
    </div>
  );
}
