import { XIcon } from './icons';
import { useNotification } from '../hooks/useNotification';

export const Notifications = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <>
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`p-4 rounded-md shadow-md text-white flex justify-between items-center ${
                notification.type === 'error'
                  ? 'bg-red-600'
                  : notification.type === 'warning'
                    ? 'bg-yellow-600'
                    : 'bg-green-600'
              }`}
            >
              <span className="mr-2">{notification.message}</span>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-white hover:text-gray-200"
              >
                <XIcon />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
