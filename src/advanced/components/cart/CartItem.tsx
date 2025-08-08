import { CartItem as CartItemType } from "../../../types";
import { useCart, useCartActions } from "../../hooks/useCart";
import { calculateItemTotal } from "../../models/cart";
import { calculatePercentageChange, multiply } from "../../utils/calculators";
import { formatPrice } from "../../utils/formatters";
import { CloseXIcon } from "../icons";

interface CartItemProps {
  item: CartItemType;
}

export const CartItem = ({ item }: CartItemProps) => {
  const { cart } = useCart();
  const { removeFromCart, updateQuantity } = useCartActions();

  const originalPrice = multiply(item.product.price, item.quantity);
  const cartItemTotalPrice = calculateItemTotal(item, cart);
  const hasDiscount = cartItemTotalPrice < originalPrice;
  const discountRate = hasDiscount
    ? calculatePercentageChange(originalPrice, cartItemTotalPrice)
    : 0;

  return (
    <div className="border-b pb-3 last:border-b-0">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-medium text-gray-900 flex-1">
          {item.product.name}
        </h4>
        <button
          onClick={() => removeFromCart(item.product.id)}
          className="text-gray-400 hover:text-red-500 ml-2"
        >
          <CloseXIcon className="w-4 h-4" />
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
          <span className="mx-3 text-sm font-medium w-8 text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
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
            {formatPrice(Math.round(cartItemTotalPrice))}원
          </p>
        </div>
      </div>
    </div>
  );
};
