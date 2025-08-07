import { ShoppingBagIcon } from "../icons";
import { CartItem } from "../../../types";
import { Button, QuantityControls, PriceDisplay } from "../ui";
import { XIcon } from "../icons";
import { cartItemUtils } from "../../utils/cartItemUtils";

export default function CartList({
  cart,
  removeFromCart,
  updateQuantity,
  calculateItemTotal,
}: {
  cart: CartItem[];
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  calculateItemTotal: (item: CartItem, cart: CartItem[]) => number;
}) {
  if (cart.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="space-y-3">
      {cart.map((item) => (
        <CartItemCard
          key={item.product.id}
          item={item}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
          calculatedItemTotal={calculateItemTotal(item, cart)}
        />
      ))}
    </div>
  );
}

const EmptyCart = () => (
  <div className="text-center py-8">
    <ShoppingBagIcon
      className="w-16 h-16 text-gray-300 mx-auto mb-4"
      size="large"
    />
    <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
  </div>
);

const CartItemCard = ({
  item,
  removeFromCart,
  updateQuantity,
  calculatedItemTotal,
}: {
  item: CartItem;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  calculatedItemTotal: number;
}) => {
  return (
    <div key={item.product.id} className="border-b pb-3 last:border-b-0">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-medium text-gray-900 flex-1">
          {item.product.name}
        </h4>
        <Button
          onClick={() => removeFromCart(item.product.id)}
          variant="ghost"
          size="small"
          className="text-gray-400 hover:text-red-500 ml-2 p-1 flex items-center justify-center"
        >
          <XIcon className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <QuantityControls
          quantity={item.quantity}
          productId={item.product.id}
          onQuantityChange={updateQuantity}
        />
        <PriceDisplay
          price={calculatedItemTotal}
          originalPrice={cartItemUtils.calculateOriginalPrice(item)}
        />
      </div>
    </div>
  );
};
