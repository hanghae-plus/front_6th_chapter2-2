interface QuantityControlsProps {
  quantity: number;
  productId: string;
  onQuantityChange: (productId: string, quantity: number) => void;
  minQuantity?: number;
  maxQuantity?: number;
}

export default function QuantityControls({
  quantity,
  productId,
  onQuantityChange,
  minQuantity = 1,
  maxQuantity = 99,
}: QuantityControlsProps) {
  const handleDecrease = () => {
    if (quantity > minQuantity) {
      onQuantityChange(productId, quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxQuantity) {
      onQuantityChange(productId, quantity + 1);
    }
  };

  return (
    <div className="flex items-center">
      <button
        onClick={handleDecrease}
        disabled={quantity <= minQuantity}
        className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="text-xs">−</span>
      </button>
      <span className="mx-3 text-sm font-medium w-8 text-center">
        {quantity}
      </span>
      <button
        onClick={handleIncrease}
        disabled={quantity >= maxQuantity}
        className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="text-xs">+</span>
      </button>
    </div>
  );
}
