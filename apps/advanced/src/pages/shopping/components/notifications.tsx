import { useNotificationService } from '@/services';
import clsx from 'clsx';

export const Notifications = () => {
  const notificationService = useNotificationService();

  if (notificationService.notifications.length === 0) return null;

  return (
    <div className='fixed top-20 right-4 z-50 space-y-2 max-w-sm'>
      {notificationService.notifications.map(notification => (
        <div
          key={notification.id}
          className={clsx([
            `p-4 rounded-md shadow-md text-white flex justify-between items-center`,
            notification.type === 'error'
              ? 'bg-red-600'
              : notification.type === 'warning'
                ? 'bg-yellow-600'
                : 'bg-green-600'
          ])}>
          <span className='mr-2'>{notification.message}</span>
          <button
            onClick={() =>
              notificationService.removeNotification(notification.id)
            }
            className='text-white hover:text-gray-200'>
            <svg
              className='w-4 h-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};
