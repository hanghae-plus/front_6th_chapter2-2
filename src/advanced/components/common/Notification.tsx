import { useAtom } from 'jotai';
import { Notification } from '../../../types';
import { CloseIcon } from '../icons';
import Button from '../ui/Button';
import { notificationsAtom } from '../../store/atoms';
import { removeNotificationAtom } from '../../store/actions';

const NotificationComponent = () => {
  const [notifications] = useAtom(notificationsAtom);
  const [, removeNotification] = useAtom(removeNotificationAtom);

  if (!notifications || notifications.length === 0) return null;

  const handleRemoveNotification = (id: string) => {
    removeNotification(id);
  };

  return (
    <div className='fixed top-20 right-4 z-50 space-y-2 max-w-sm'>
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`p-4 rounded-md shadow-md text-white flex justify-between items-center ${
            notif.type === 'error'
              ? 'bg-red-600'
              : notif.type === 'warning'
              ? 'bg-yellow-600'
              : 'bg-green-600'
          }`}
        >
          <span className='mr-2'>{notif.message}</span>
          <Button
            onClick={() => handleRemoveNotification(notif.id)}
            className='text-white hover:text-gray-200'
          >
            <CloseIcon />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default NotificationComponent;
