import { useAtom } from 'jotai';
import { XIcon } from '@/icons';
import { Button } from '@/ui/Button';
import { notificationsAtom } from '../atoms';

export const Notification = () => {
  const [notifications, setNotifications] = useAtom(notificationsAtom);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
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
          <span className="mr-2">{notif.message}</span>
          <Button
            onClick={() => setNotifications(notifications.filter((n) => n.id !== notif.id))}
            variant="ghost"
            size="sm"
            className="text-white hover:text-gray-200 p-1"
          >
            <XIcon />
          </Button>
        </div>
      ))}
    </div>
  );
};
