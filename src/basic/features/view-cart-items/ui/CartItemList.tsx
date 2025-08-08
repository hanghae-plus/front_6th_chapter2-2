import { CartItem } from "@entities/cart";
import type { Cart } from "@entities/cart/types";
import CartBagIcon from "@assets/icons/CartBagIcon.svg?react";

interface CartItemListProps {
  cartItems: Cart[];
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  calculateItemTotal: (item: Cart) => number;
}

export function CartItemList({
  cartItems,
  onRemoveItem,
  onUpdateQuantity,
  calculateItemTotal,
}: CartItemListProps) {
  if (cartItems.length === 0) {
    return (
      <div className="text-center py-8">
        <CartBagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {cartItems.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          calculateItemTotal={calculateItemTotal}
          removeFromCart={onRemoveItem}
          updateQuantity={onUpdateQuantity}
        />
      ))}
    </div>
  );
}
