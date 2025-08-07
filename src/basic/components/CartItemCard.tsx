// src/basic/components/CartItemCard.tsx
import { CartItem } from '../types';
import { formatCurrency } from '../utils/formatters';
import { getMaxApplicableDiscount } from '../models/cart';

interface Props {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
}

export const CartItemCard = ({ item, onUpdateQuantity, onRemoveFromCart }: Props) => {
  const discount = getMaxApplicableDiscount(item);
  const discountRateText = `-${Math.round(discount.rate * 100)}%`;

  return (
    <div className="border-b pb-3 last:border-b-0">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-medium text-gray-900 flex-1">{item.name}</h4>
        <button
          onClick={() => onRemoveFromCart(item.id)}
          className="text-gray-400 hover:text-red-500 ml-2"
          aria-label={`${item.name} 삭제`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
            aria-label={`${item.name} 수량 감소`}
          >
            <span className="text-xs">−</span>
          </button>
          <span className="mx-3 text-sm font-medium w-8 text-center" aria-label={`${item.name} 수량`}>{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
            aria-label={`${item.name} 수량 증가`}
          >
            <span className="text-xs">+</span>
          </button>
        </div>
        <div className="text-right">
          {discount.rate > 0 && (
            <span className="text-xs text-red-500 font-medium block">{discountRateText}</span>
          )}
          <p className="text-sm font-medium text-gray-900">
            {formatCurrency(item.price * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  )
}
