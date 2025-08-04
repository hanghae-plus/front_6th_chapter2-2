import { HTMLAttributes } from 'react';

import type { Notification, NotificationVariant } from '../../../types';

interface NotificationProps {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

export function Notifications({ notifications, setNotifications }: NotificationProps) {
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
              onClick={() => setNotifications((prev) => prev.filter((n) => n.id !== id))}
              className='text-white hover:text-gray-200'
            >
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
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
