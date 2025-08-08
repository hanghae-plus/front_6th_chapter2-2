interface QuantityDisplayProps {
  quantity: number;
  className?: string;
  minWidth?: string;
}

export function QuantityDisplay({
  quantity,
  className = '',
  minWidth = 'w-8',
}: QuantityDisplayProps) {
  return (
    <span className={`mx-3 text-sm font-medium text-center ${minWidth} ${className}`}>
      {quantity}
    </span>
  );
}
