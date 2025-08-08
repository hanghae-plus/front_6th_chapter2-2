import { CloseIcon } from '../icons';

type Type = 'error' | 'warning' | 'success';

interface Props {
  type: Type;
  message: string;
  onClose: () => void;
}

type Options = Record<Type, { className: string }>;

export function UIToast({ type, message, onClose }: Props) {
  const options: Options = {
    error: {
      className: 'bg-red-600',
    },
    warning: {
      className: 'bg-yellow-600',
    },
    success: {
      className: 'bg-green-600',
    },
  };

  const { className } = options[type];

  return (
    <div
      className={`p-4 rounded-md shadow-md text-white flex justify-between items-center ${className}`}
    >
      <span className="mr-2">{message}</span>
      <button onClick={onClose} className="text-white hover:text-gray-200">
        <CloseIcon />
      </button>
    </div>
  );
}
