import Toast from './Toast.tsx';
import { Notification } from '../../../models/components/toast.types.ts';

interface ToastContainerProps {
  notifications: Notification[];
  onClose: (id: string) => void;
}
const ToastContainer = ({ notifications, onClose }: ToastContainerProps) => {
  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map(notif => (
        <Toast key={notif.id} notification={notif} onClose={onClose} />
      ))}
    </div>
  );
};

export default ToastContainer;
