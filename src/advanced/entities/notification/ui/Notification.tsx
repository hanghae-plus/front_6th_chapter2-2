import { useEffect } from 'react';

import { Icon } from '../../../shared/icon';
import type { Notification as NotificationType } from '../consts';
import { getToastBgColorByVariant } from '../lib';

interface NotificationProps {
  notification: NotificationType;
  onRemoveNotification: (id: string) => void;
}

export function Notification({ notification, onRemoveNotification }: NotificationProps) {
  const { id, message, variant } = notification;
  const bgColor = getToastBgColorByVariant(variant);

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemoveNotification(id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [id, onRemoveNotification]);

  return (
    <div
      className={`p-4 rounded-md shadow-md text-white flex justify-between items-center ${bgColor}`}
    >
      <span className='mr-2'>{message}</span>
      <button onClick={() => onRemoveNotification(id)} className='text-white hover:text-gray-200'>
        <Icon name='x' width={16} height={16} />
      </button>
    </div>
  );
}
