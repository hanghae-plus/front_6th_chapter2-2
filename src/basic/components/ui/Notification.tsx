import React from 'react';

interface NotificationProps {
  message: string;
  type: 'error' | 'success' | 'warning';
  onClose: () => void;
  className?: string;
}

export const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  onClose,
  className = '',
}) => {
  const baseClasses =
    'p-4 rounded-md shadow-md text-white flex justify-between items-center';

  const typeClasses = {
    error: 'bg-red-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
  };

  const combinedClasses = [baseClasses, typeClasses[type], className].join(' ');

  return (
    <div className={combinedClasses}>
      <span className='mr-2'>{message}</span>
      <button
        onClick={onClose}
        className='text-white hover:text-gray-200 transition-colors'
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
  );
};
