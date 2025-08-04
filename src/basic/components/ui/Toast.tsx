import IconButton from './IconButton';

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

      <IconButton variant='toast' onClick={onClose}>
        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M6 18L18 6M6 6l12 12'
          />
        </svg>
      </IconButton>
    </div>
  );
}
