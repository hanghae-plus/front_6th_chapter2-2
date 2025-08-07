import React from 'react';
import { ProductWithUI } from '../../../../types';
import { calculateItemTotal } from '../../../../utils/calculators';

interface CartItemProps {
  item: {
    product: ProductWithUI;
    quantity: number;
  };
  cart: Array<{ product: ProductWithUI; quantity: number }>;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  cart,
  onUpdateQuantity,
  onRemoveFromCart,
}) => {
  const itemTotal = calculateItemTotal(item, cart);
  const originalPrice = item.product.price * item.quantity;
  const hasDiscount = itemTotal < originalPrice;
  const discountRate = hasDiscount
    ? Math.round((1 - itemTotal / originalPrice) * 100)
    : 0;

  return (
    <div className='border-b pb-3 last:border-b-0'>
      <div className='flex justify-between items-start mb-2'>
        <h4 className='text-sm font-medium text-gray-900 flex-1'>
          {item.product.name}
        </h4>
        <button
          onClick={() => onRemoveFromCart(item.product.id)}
          className='text-gray-400 hover:text-red-500 ml-2'
          aria-label='장바구니에서 제거'
        >
          <svg
            className='w-4 h-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </button>
      </div>

      <div className='flex items-center justify-between'>
        <div className='flex items-center'>
          <button
            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
            className='w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100'
            aria-label='수량 감소'
          >
            <span className='text-xs'>−</span>
          </button>
          <span className='mx-3 text-sm font-medium w-8 text-center'>
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
            className='w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100'
            aria-label='수량 증가'
          >
            <span className='text-xs'>+</span>
          </button>
        </div>

        <div className='text-right'>
          {hasDiscount && (
            <span className='text-xs text-red-500 font-medium block'>
              -{discountRate}%
            </span>
          )}
          <p className='text-sm font-medium text-gray-900'>
            {Math.round(itemTotal).toLocaleString()}원
          </p>
        </div>
      </div>
    </div>
  );
};
