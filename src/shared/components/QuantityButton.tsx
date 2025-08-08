interface QuantityButtonProps {
  type: 'increase' | 'decrease';
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export function QuantityButton({
  type,
  onClick,
  disabled = false,
  className = '',
}: QuantityButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <span className="text-xs">{type === 'increase' ? '+' : '−'}</span>
    </button>
  );
}
