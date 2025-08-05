import { CloseIcon } from '../../icons/CloseIcon.tsx';
import { Notification } from '../../../models/components/toast.types.ts';

interface ToastProps {
  notification: Notification;
  onClose: (id: string) => void;
}

const Toast = ({ notification, onClose }: ToastProps) => {
  const typeStyles = {
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600',
  };

  return (
    <div
      className={`p-4 rounded-md shadow-md text-white flex justify-between items-center ${typeStyles[notification.type]}`}
    >
      <span className="mr-2">{notification.message}</span>
      <button
        onClick={() => onClose(notification.id)}
        className="text-white hover:text-gray-200 transition-colors"
      >
        <CloseIcon />
      </button>
    </div>
  );
};
export default Toast;
