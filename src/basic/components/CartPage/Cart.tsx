import { BagIcon, EmptyBagIcon, BagCloseIcon } from "../icons";
import { CartItem } from "../../../types";

interface CartProps {
  cart: CartItem[]; // 타입을 명확히 정의
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  calculateItemTotal: (item: CartItem) => number;
}

export function Cart({
  cart,
  removeFromCart,
  updateQuantity,
  calculateItemTotal,
}: CartProps) {
  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <BagIcon className="w-5 h-5 mr-2" />
        장바구니
      </h2>
      {cart.length === 0 ? (
        <div className="text-center py-8">
          <EmptyBagIcon />
          <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cart.map((item) => {
            const itemTotal = calculateItemTotal(item);
            const originalPrice = item.product.price * item.quantity;
            const hasDiscount = itemTotal < originalPrice;
            const discountRate = hasDiscount
              ? Math.round((1 - itemTotal / originalPrice) * 100)
              : 0;

            return (
              <div
                key={item.product.id}
                className="border-b pb-3 last:border-b-0"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-medium text-gray-900 flex-1">
                    {item.product.name}
                  </h4>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-gray-400 hover:text-red-500 ml-2"
                  >
                    <BagCloseIcon />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                      className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    >
                      <span className="text-xs">−</span>
                    </button>
                    <span className="mx-3 text-sm font-medium w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    >
                      <span className="text-xs">+</span>
                    </button>
                  </div>
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
}
