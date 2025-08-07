interface Props {
  type: 'error' | 'warning' | 'success';
  message: string;
  onClose: () => void;
}

type Options = Record<
  Props['type'],
  {
    className: string;
  }
>;

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
        {/* icon */}
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
