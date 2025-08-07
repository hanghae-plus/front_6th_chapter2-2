import {
  useNotifications,
  useRemoveNotification,
} from '../hooks/useNotification';
import { UIToast } from './ui/UIToast';

export function Notifications() {
  const notifications = useNotifications();
  const removeNotification = useRemoveNotification();

  return (
    notifications.length > 0 && (
      <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
        {notifications.map(({ id, message, type }) => (
          <UIToast
            key={id}
            message={message}
            type={type}
            onClose={() => {
              removeNotification({ id });
            }}
          />
        ))}
      </div>
    )
  );
}
