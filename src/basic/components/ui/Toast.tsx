import IconButton from './IconButton';
import { DeleteIcon } from './Icons';

interface ToastProps {
  type: 'success' | 'warning' | 'error';
  message: string;
  onClose?: () => void;
}

export default function Toast({ type, message, onClose }: ToastProps) {
  const baseClasses = 'p-4 rounded-md shadow-md text-white flex justify-between items-center';

  const typeClasses = {
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600',
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <span className='mr-2'>{message}</span>

      <IconButton variant='toast' onClick={onClose} icon={<DeleteIcon />} />
    </div>
  );
}
