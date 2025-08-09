import { NotificationItem } from './notification-item';
import { useNotifications } from '../contexts';

export function Notifications() {
  const { notifications, removeNotification } = useNotifications();
  if (notifications.length === 0) return null;
  return (
    <div className='fixed top-20 right-4 z-50 space-y-2 max-w-sm' aria-live='polite'>
      {notifications.map((notif) => (
        <NotificationItem
          key={notif.id}
          notif={notif}
          onClose={() => removeNotification(notif.id)}
        />
      ))}
    </div>
  );
}
