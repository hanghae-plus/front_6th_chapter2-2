import { CloseIcon } from "../../../shared";

type CartItemHeaderProps = {
  productName: string;
  productId: string;
  onRemove: (productId: string) => void;
};

export function CartItemHeader({ productName, productId, onRemove }: CartItemHeaderProps) {
  const handleRemove = () => {
    onRemove(productId);
  };

  return (
    <div className="mb-2 flex items-start justify-between">
      <h4 className="flex-1 text-sm font-medium text-gray-900">{productName}</h4>
      <button onClick={handleRemove} className="ml-2 text-gray-400 hover:text-red-500">
        <CloseIcon />
      </button>
    </div>
  );
}
