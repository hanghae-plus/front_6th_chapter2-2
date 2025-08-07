import type { ProductWithUI } from '../../shared/types';
import { formatKoreanPrice, formatPercentage } from '../../shared/utils';
import { CloseIcon, SmallBagIcon, LargeBagIcon } from '../icons';

interface CartProps {
  cart: Array<{ product: ProductWithUI; quantity: number }>;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  calculateTotal: () => { totalBeforeDiscount: number; totalAfterDiscount: number };
}

export function Cart({ cart, removeFromCart, updateQuantity, calculateTotal }: CartProps) {
  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <SmallBagIcon />
        장바구니
      </h2>
      {cart.length === 0 ? (
        <div className="text-center py-8">
          <LargeBagIcon />
          <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cart.map((item) => {
            const itemTotal = calculateTotal().totalAfterDiscount;
            const originalPrice = item.product.price * item.quantity;
            const hasDiscount = itemTotal < originalPrice;
            const discountRate = hasDiscount ? formatPercentage(1 - itemTotal / originalPrice) : 0;

            return (
              <div key={item.product.id} className="border-b pb-3 last:border-b-0">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-medium text-gray-900 flex-1">{item.product.name}</h4>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-gray-400 hover:text-red-500 ml-2"
                  >
                    <CloseIcon />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    >
                      <span className="text-xs">−</span>
                    </button>
                    <span className="mx-3 text-sm font-medium w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    >
                      <span className="text-xs">+</span>
                    </button>
                  </div>
                  <div className="text-right">
                    {hasDiscount && <span className="text-xs text-red-500 font-medium block">-{discountRate}</span>}
                    <p className="text-sm font-medium text-gray-900">{formatKoreanPrice(itemTotal)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
