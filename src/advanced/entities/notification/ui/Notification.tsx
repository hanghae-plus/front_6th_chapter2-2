import { useSetAtom } from 'jotai';
import { useEffect } from 'react';

import { Icon } from '../../../shared/icon';
import type { Notification as NotificationType } from '../consts';
import { getToastBgColorByVariant } from '../lib';
import { removeNotificationAtom } from '../model/atom';

interface NotificationProps {
  notification: NotificationType;
}

export function Notification({ notification }: NotificationProps) {
  const removeNotification = useSetAtom(removeNotificationAtom);

  const { id, message, variant } = notification;
  const bgColor = getToastBgColorByVariant(variant);

  useEffect(() => {
    const timer = setTimeout(() => {
      removeNotification(id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [id, removeNotification]);

  return (
    <div
      className={`p-4 rounded-md shadow-md text-white flex justify-between items-center ${bgColor}`}
    >
      <span className='mr-2'>{message}</span>
      <button onClick={() => removeNotification(id)} className='text-white hover:text-gray-200'>
        <Icon name='x' width={16} height={16} />
      </button>
    </div>
  );
}
