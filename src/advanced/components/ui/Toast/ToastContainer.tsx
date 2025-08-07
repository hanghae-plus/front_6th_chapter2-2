import Toast from './Toast.tsx';
import { useAtomValue } from 'jotai';
import {
  notificationsAtom,
  removeNotificationAtom,
} from '../../../store/common/notification.store.ts';
import { useSetAtom } from 'jotai/index';

const ToastContainer = () => {
  const notifications = useAtomValue(notificationsAtom);
  const closeToast = useSetAtom(removeNotificationAtom);
  return (
    notifications?.length > 0 && (
      <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
        {notifications.map(notif => (
          <Toast key={notif.id} notification={notif} onClose={closeToast} />
        ))}
      </div>
    )
  );
};

export default ToastContainer;
