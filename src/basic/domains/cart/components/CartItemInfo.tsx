import { CartItem } from "../types";
import { CartItemHeader } from "./CartItemHeader";
import { ItemPricing } from "./ItemPricing";
import { QuantitySelector } from "./QuantitySelector";

type CartItemInfoProps = {
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  item: CartItem;
  itemTotal: number;
};

export function CartItemInfo({
  updateQuantity,
  removeFromCart,
  item,
  itemTotal
}: CartItemInfoProps) {
  const originalPrice = item.product.price * item.quantity;
  const hasDiscount = itemTotal < originalPrice;
  const discountRate = hasDiscount ? Math.round((1 - itemTotal / originalPrice) * 100) : 0;

  return (
    <div className="border-b pb-3 last:border-b-0">
      <CartItemHeader
        productName={item.product.name}
        productId={item.product.id}
        onRemove={removeFromCart}
      />

      <div className="flex items-center justify-between">
        <QuantitySelector
          quantity={item.quantity}
          productId={item.product.id}
          onUpdateQuantity={updateQuantity}
        />

        <ItemPricing itemTotal={itemTotal} hasDiscount={hasDiscount} discountRate={discountRate} />
      </div>
    </div>
  );
}
