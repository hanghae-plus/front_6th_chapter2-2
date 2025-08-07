import type { CartItem } from '../../../../types';
import { useRemoveFromCart, useUpdateQuantity } from '../../../hooks/useCart';
import { useProducts } from '../../../hooks/useProducts';
import { formatNumberRate, formatNumberWon } from '../../../utils/formatters';
import { CloseIcon } from '../../icons';

interface Props {
  discountRate: number;
  itemTotal: number;
  cartItem: CartItem;
}

export function CartItemInfo({ discountRate, itemTotal, cartItem }: Props) {
  const products = useProducts();
  const removeFromCart = useRemoveFromCart();
  const updateQuantity = useUpdateQuantity();
  const { product, quantity } = cartItem;

  return (
    <div key={product.id} className="border-b pb-3 last:border-b-0">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-medium text-gray-900 flex-1">
          {product.name}
        </h4>
        <button
          onClick={() => removeFromCart({ productId: product.id })}
          className="text-gray-400 hover:text-red-500 ml-2"
        >
          <CloseIcon />
        </button>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() =>
              updateQuantity({
                productId: product.id,
                newQuantity: quantity - 1,
                products,
              })
            }
            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
          >
            <span className="text-xs">−</span>
          </button>
          <span className="mx-3 text-sm font-medium w-8 text-center">
            {quantity}
          </span>
          <button
            onClick={() =>
              updateQuantity({
                productId: product.id,
                newQuantity: quantity + 1,
                products,
              })
            }
            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
          >
            <span className="text-xs">+</span>
          </button>
        </div>
        <div className="text-right">
          {discountRate > 0 && (
            <span className="text-xs text-red-500 font-medium block">
              {formatNumberRate({ number: -discountRate })}
            </span>
          )}
          <p className="text-sm font-medium text-gray-900">
            {formatNumberWon({ number: Math.round(itemTotal) })}
          </p>
        </div>
      </div>
    </div>
  );
}
