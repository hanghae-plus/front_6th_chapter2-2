import React, { useEffect } from 'react';
import IconButton from './IconButton';
import { DeleteIcon } from './Icons';
import { useSetAtom } from 'jotai';
import { removeNotificationAtom } from '../../atoms/notificationsAtoms';

interface ToastProps {
  id: string;
  type: 'success' | 'warning' | 'error';
  message: string;
}

const Toast = React.memo(function Toast({ id, type, message }: ToastProps) {
  const removeNotification = useSetAtom(removeNotificationAtom);

  const baseClasses = 'p-4 rounded-md shadow-md text-white flex justify-between items-center';

  const typeClasses = {
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600',
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      removeNotification(id);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleClose = () => removeNotification(id);

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <span className='mr-2'>{message}</span>
      <IconButton variant='toast' onClick={handleClose} icon={<DeleteIcon />} />
    </div>
  );
});

export default Toast;
