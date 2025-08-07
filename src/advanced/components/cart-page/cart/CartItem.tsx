import type { CartItem, Product } from '../../../../types';
import { useRemoveFromCart } from '../../../hooks/useCart';
import { formatNumberRate, formatNumberWon } from '../../../utils/formatters';

interface Props {
  products: Product[];
  discountRate: number;
  itemTotal: number;
  cartItem: CartItem;
  updateQuantity: (params: {
    productId: string;
    newQuantity: number;
    products: Product[];
  }) => void;
}

export function CartItemInfo({
  products,
  discountRate,
  itemTotal,
  cartItem,
  updateQuantity,
}: Props) {
  const removeFromCart = useRemoveFromCart();
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
