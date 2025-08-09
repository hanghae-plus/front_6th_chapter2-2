import { Product } from "../../../types";
import { CartIcon, TrashIcon } from "../icons";
import { calculateItemTotal, getRemainingStock } from "../../utils/cartUtils";
import { useCart } from "../../hooks/useCart";
import { useCallback } from "react";
import { useNotifications } from "../../hooks/useNotifications";

export function CartSection({}: {}) {
  const { cart, removeFromCart, updateCartItemQuantity } = useCart();

  const { addNotification } = useNotifications();

  // 장바구니 상품 수량 변경 (props로 받은 함수 사용)
  const handleUpdateQuantity = useCallback(
    (product: Product, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(product.id);
        return;
      }

      if (newQuantity > product.stock) {
        addNotification?.(`재고는 ${product.stock}개까지만 있습니다.`, "error");
        return;
      }

      if (!getRemainingStock(product, cart)) {
        addNotification("재고가 부족합니다", "error");
        return;
      }

      updateCartItemQuantity(product.id, newQuantity);
    },
    [addNotification, cart, removeFromCart, updateCartItemQuantity]
  );

  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <CartIcon className="w-5 h-5 mr-2" />
        장바구니
      </h2>
      {cart.length === 0 ? (
        <div className="text-center py-8">
          <CartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cart.map((item) => {
            const itemTotal = calculateItemTotal(item, cart);
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
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.product, item.quantity - 1)
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
                        handleUpdateQuantity(item.product, item.quantity + 1)
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
