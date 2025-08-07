import { useAtomValue } from 'jotai';

import { Notification } from '../../entities/notification';
import { notificationsAtom } from '../../entities/notification/model/atom';

export function NotificationProvider() {
  const notifications = useAtomValue(notificationsAtom);

  if (notifications.length === 0) return null;

  return (
    <div className='fixed top-20 right-4 z-50 space-y-2 max-w-sm'>
      {notifications.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}
    </div>
  );
}
