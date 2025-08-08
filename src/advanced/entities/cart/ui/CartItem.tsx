import CloseIcon from "@assets/icons/CloseIcon.svg?react";
import { Button, IconButton } from "@shared";
import { memo } from "react";
import type { Cart } from "@entities/cart/types";

interface CartItemProps {
  item: Cart;
  calculateItemTotal: (item: Cart) => number;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
}

export const CartItem = memo(
  ({
    item,
    calculateItemTotal,
    removeFromCart,
    updateQuantity,
  }: CartItemProps) => {
    const itemTotal = calculateItemTotal(item);
    const originalPrice = item.price * item.quantity;
    const hasDiscount = itemTotal < originalPrice;
    const discountRate = hasDiscount
      ? Math.round((1 - itemTotal / originalPrice) * 100)
      : 0;

    return (
      <div className="border-b pb-3 last:border-b-0">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-sm font-medium text-gray-900 flex-1">
            {item.name}
          </h4>
          <IconButton
            variant="icon"
            onClick={() => removeFromCart(item.id)}
            className="text-gray-400 hover:text-red-500 ml-2"
          >
            <CloseIcon className="w-4 h-4" />
          </IconButton>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="secondary"
              size="xs"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
            >
              <span className="text-xs">−</span>
            </Button>
            <span className="mx-3 text-sm font-medium w-8 text-center">
              {item.quantity}
            </span>
            <Button
              variant="secondary"
              size="xs"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
            >
              <span className="text-xs">+</span>
            </Button>
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
  }
);
