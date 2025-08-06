import { ICartItem } from "../../type";
import { CloseIcon } from "../icon";
import { formatPercentage } from "../../utils/formatters";
import { useProducts } from "../../hooks/useProducts";
import { useNotification } from "../../hooks/useNotification";
import { useCart } from "../../hooks/useCart";
import { useCallback } from "react";
import { MESSAGES } from "../../constants/messages";

interface CartItemProps {
  item: ICartItem;
}

const CartItem = ({ item }: CartItemProps) => {
  const { products } = useProducts();
  const { addNotification } = useNotification();
  const {
    updateQuantity,
    removeFromCart,
    calculateItemTotal,
    getRemainingStock,
  } = useCart();

  const itemTotal = calculateItemTotal(item);
  const originalPrice = item.product.price * item.quantity;
  const hasDiscount = itemTotal < originalPrice;
  const discountRate = hasDiscount ? 1 - itemTotal / originalPrice : 0;

  // 장바구니의 상품 수 업데이트 (-1, +1 처리)
  const updateItemQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeItemFromCart(productId);
        return;
      }

      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const maxStock = product.stock;
      if (newQuantity > maxStock) {
        addNotification(MESSAGES.PRODUCT.MAX_STOCK(maxStock));
        return;
      }

      updateQuantity(productId, newQuantity);
    },
    [products, addNotification, getRemainingStock]
  );

  // 장바구니에서 상품 제거
  const removeItemFromCart = useCallback((productId: string) => {
    removeFromCart(productId);
  }, []);

  return (
    <div key={item.product.id} className="border-b pb-3 last:border-b-0">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-medium text-gray-900 flex-1">
          {item.product.name}
        </h4>
        <button
          onClick={() => removeItemFromCart(item.product.id)}
          className="text-gray-400 hover:text-red-500 ml-2"
        >
          {/* 장바구니 상품 - x 아이콘 */}
          <CloseIcon />
        </button>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() =>
              updateItemQuantity(item.product.id, item.quantity - 1)
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
              updateItemQuantity(item.product.id, item.quantity + 1)
            }
            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
          >
            <span className="text-xs">+</span>
          </button>
        </div>
        <div className="text-right">
          {hasDiscount && (
            <span className="text-xs text-red-500 font-medium block">
              -{formatPercentage(discountRate)}
            </span>
          )}
          <p className="text-sm font-medium text-gray-900">
            {Math.round(itemTotal).toLocaleString()}원
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
