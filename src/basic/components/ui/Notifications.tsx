import { HTMLAttributes } from 'react';

import type { Notification, NotificationVariant } from '../../../types';
import { Icon } from '../icons';

interface NotificationProps {
  notifications: Notification[];
  onRemoveNotification: (id: string) => void;
}

export function Notifications({ notifications, onRemoveNotification }: NotificationProps) {
  if (notifications.length === 0) return null;

  return (
    <div className='fixed top-20 right-4 z-50 space-y-2 max-w-sm'>
      {notifications.map((notification) => {
        const { id, message, variant } = notification;
        const bgColor = getToastBgColorByVariant(variant);

        return (
          <div
            className={`p-4 rounded-md shadow-md text-white flex justify-between items-center ${bgColor}`}
          >
            <span className='mr-2'>{message}</span>
            <button
              onClick={() => onRemoveNotification(id)}
              className='text-white hover:text-gray-200'
            >
              <Icon name='x' width={16} height={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

function getToastBgColorByVariant(
  variant: NotificationVariant
): HTMLAttributes<HTMLDivElement>['className'] {
  if (variant === 'error') return 'bg-red-600';
  if (variant === 'warning') return 'bg-yellow-600';
  if (variant === 'success') return 'bg-green-600';

  return 'bg-gray-600';
}
