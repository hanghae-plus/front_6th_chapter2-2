import { useEffect, useState } from 'react';

import { Notification } from '../types';

interface ToastProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

interface ToastItemProps {
  notification: Notification;
  onRemove: (id: string) => void;
}

const ToastItem = ({ notification, onRemove }: ToastItemProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    // 마운트 시 애니메이션
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // 5초 후 자동 제거
    const autoRemoveTimer = setTimeout(() => {
      handleRemove();
    }, 5000);

    return () => clearTimeout(autoRemoveTimer);
  }, []);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(notification.id);
    }, 300); // 애니메이션 시간과 맞춤
  };

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'error':
        return 'bg-red-600';
      case 'warning':
        return 'bg-yellow-600';
      default:
        return 'bg-green-600';
    }
  };

  return (
    <div
      className={`transform transition-all duration-300 ease-in-out ${
        isVisible && !isRemoving
          ? 'translate-x-0 opacity-100 scale-100'
          : 'translate-x-full opacity-0 scale-95'
      }`}
    >
      <div
        className={`p-4 rounded-md shadow-lg text-white flex justify-between items-center ${getBackgroundColor()} min-w-0`}
      >
        <span className='mr-2 flex-1 text-sm font-medium break-words'>{notification.message}</span>
        <button
          onClick={handleRemove}
          className='text-white hover:text-gray-200 transition-colors duration-150 flex-shrink-0 ml-2'
          aria-label='알림 닫기'
        >
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export const Toast = ({ notifications, onRemove }: ToastProps) => {
  if (notifications.length === 0) return null;

  return (
    <div className='fixed top-20 right-4 z-50 space-y-2 max-w-sm w-full pr-4'>
      {notifications.map((notification) => (
        <ToastItem key={notification.id} notification={notification} onRemove={onRemove} />
      ))}
    </div>
  );
};
