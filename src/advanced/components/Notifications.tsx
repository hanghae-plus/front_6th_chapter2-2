import type { Notification } from '../../types';
import { UIToast } from './ui/UIToast';

interface Props {
  notifications: Notification[];
  removeNotification: (params: { id: string }) => void;
}

export function Notifications({ notifications, removeNotification }: Props) {
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
