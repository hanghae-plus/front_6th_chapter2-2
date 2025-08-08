type QuantitySelectorProps = {
  quantity: number;
  productId: string;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
};

export function QuantitySelector({ quantity, productId, onUpdateQuantity }: QuantitySelectorProps) {
  const handleDecrease = () => {
    onUpdateQuantity(productId, quantity - 1);
  };

  const handleIncrease = () => {
    onUpdateQuantity(productId, quantity + 1);
  };

  return (
    <div className="flex items-center">
      <button
        onClick={handleDecrease}
        className="flex h-6 w-6 items-center justify-center rounded border border-gray-300 hover:bg-gray-100"
      >
        <span className="text-xs">−</span>
      </button>
      <span className="mx-3 w-8 text-center text-sm font-medium">{quantity}</span>
      <button
        onClick={handleIncrease}
        className="flex h-6 w-6 items-center justify-center rounded border border-gray-300 hover:bg-gray-100"
      >
        <span className="text-xs">+</span>
      </button>
    </div>
  );
}
