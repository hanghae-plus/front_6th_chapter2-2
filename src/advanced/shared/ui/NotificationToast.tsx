import { useAtom } from 'jotai';
import { notificationsAtom } from '../store';

export default function NotificationToast() {
  const [notifications, setNotifications] = useAtom(notificationsAtom);
  
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  if (notifications.length === 0) return null;

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
          <button
            onClick={() => removeNotification(notif.id)}
            className='text-white hover:text-gray-200'
            aria-label='알림 닫기'
          >
            <svg
              className='w-4 h-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
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
}
