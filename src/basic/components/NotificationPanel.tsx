import { CloseIcon } from './icons';
import { Notification } from '../../types';

interface NotificationPanelProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

export const NotificationPanel = ({ notifications, onDismiss }: NotificationPanelProps) => {
  return (
    notifications.length > 0 && (
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
            <button onClick={() => onDismiss(notif.id)} className='text-white hover:text-gray-200'>
              <CloseIcon />
            </button>
          </div>
        ))}
      </div>
    )
  );
};
