import { ShoppingBagIcon } from "../../../shared";
import type { CartItem } from "../types";
import { CartItemInfo } from "./CartItemInfo";

type CartItemListProps = {
  cart: CartItem[];
  calculateItemTotal: (item: CartItem) => number;
  updateQuantity: (productId: string, newQuantity: number) => void;
  removeFromCart: (productId: string) => void;
};

export function CartItemList({
  cart,
  calculateItemTotal,
  updateQuantity,
  removeFromCart
}: CartItemListProps) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4">
      <h2 className="mb-4 flex items-center text-lg font-semibold">
        <ShoppingBagIcon className="mr-2 h-5 w-5" />
        장바구니
      </h2>
      {cart.length === 0 ? (
        <div className="py-8 text-center">
          <ShoppingBagIcon className="mx-auto mb-4 h-16 w-16 text-gray-300" strokeWidth={1} />
          <p className="text-sm text-gray-500">장바구니가 비어있습니다</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cart.map((item) => (
            <CartItemInfo
              key={item.product.id}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
              item={item}
              itemTotal={calculateItemTotal(item)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
