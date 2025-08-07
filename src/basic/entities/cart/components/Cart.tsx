import { CartItemType } from '@/types';
import { ShoppingBagIcon, XIcon } from '@/icons';
import { calculateItemTotal } from '@/utils';
import { Button } from '@/ui';

interface CartPropsType {
  cart: CartItemType[];
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
}

export const Cart = ({ cart, removeFromCart, updateQuantity }: CartPropsType) => {
  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <ShoppingBagIcon />
        장바구니
      </h2>
      {/* 장바구니가 비어있을 때 */}
      {cart.length === 0 ? (
        <div className="text-center py-8">
          <ShoppingBagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* 장바구니 아이템 목록 */}
          {cart.map((item) => {
            const itemTotal = calculateItemTotal(item, cart);
            const originalPrice = item.product.price * item.quantity;
            const hasDiscount = itemTotal < originalPrice;
            const discountRate = hasDiscount
              ? Math.round((1 - itemTotal / originalPrice) * 100)
              : 0;

            return (
              <div key={item.product.id} className="border-b pb-3 last:border-b-0">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-medium text-gray-900 flex-1">{item.product.name}</h4>
                  <Button
                    onClick={() => removeFromCart(item.product.id)}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-red-500 ml-2 p-1"
                  >
                    <XIcon />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  {/* 수량 조절 버튼 */}
                  <div className="flex items-center">
                    <Button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      variant="outline"
                      size="sm"
                      className="w-6 h-6 p-0 flex items-center justify-center"
                    >
                      <span className="text-xs">−</span>
                    </Button>
                    <span className="mx-3 text-sm font-medium w-8 text-center">
                      {item.quantity}
                    </span>
                    <Button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      variant="outline"
                      size="sm"
                      className="w-6 h-6 p-0 flex items-center justify-center"
                    >
                      <span className="text-xs">+</span>
                    </Button>
                  </div>
                  {/* 가격 정보 */}
                  <div className="text-right">
                    {hasDiscount && (
                      <span className="text-xs text-red-500 font-medium block">
                        -{discountRate}%
                      </span>
                    )}
                    <p className="text-sm font-medium text-gray-900">
                      {Math.round(itemTotal).toLocaleString()}원
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
