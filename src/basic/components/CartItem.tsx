import { CartItem } from '../../types';
import { Button } from './ui/Button';

// components/CartItem.tsx
interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  calculateItemTotal: (item: CartItem) => number;
}

export const CartItemComponent = ({
  item,
  onUpdateQuantity,
  onRemove,
  calculateItemTotal,
}: CartItemProps) => {
  const itemTotal = calculateItemTotal(item);

  return (
    <div className="border-b pb-3 last:border-b-0">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-medium text-gray-900 flex-1">
          {item.product.name}
        </h4>
        <Button
          onClick={() => onRemove(item.product.id)}
          variant="danger"
          icon={
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
          }
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
            variant="secondary"
            className="w-6 h-6"
          >
            <span className="text-xs">−</span>
          </Button>
          <span className="mx-3 text-sm font-medium w-8 text-center">
            {item.quantity}
          </span>
          <Button
            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
            variant="secondary"
            className="w-6 h-6"
          >
            <span className="text-xs">+</span>
          </Button>
        </div>
        <p className="text-sm font-medium text-gray-900">
          {itemTotal.toLocaleString()}원
        </p>
        {(() => {
          const originalPrice = item.product.price * item.quantity;
          const hasDiscount = itemTotal < originalPrice;
          const discountRate = hasDiscount
            ? Math.round((1 - itemTotal / originalPrice) * 100)
            : 0;
          return (
            hasDiscount && (
              <span className="text-xs text-red-500 font-medium block">
                -{discountRate}%
              </span>
            )
          );
        })()}
      </div>
    </div>
  );
};
