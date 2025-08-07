import { ShoppingBagIcon } from "../../icons";
import { CartIsEmpty } from "./CartIsEmpty";
import { CartItem } from "./CartItem";
import {
  calculateItemTotal,
  getMaxApplicableDiscount,
  hasBulkPurchase,
} from "../../../models/cart";
import { useCart } from "../../../hooks/useCart";
import { useProducts } from "../../../hooks/useProducts";

export function Cart() {
  const { products } = useProducts();
  const { cart, removeFromCart, updateQuantity } = useCart();

  const discount = getMaxApplicableDiscount({
    discounts: cart.flatMap((item) => item.product.discounts),
    quantity: cart.reduce((acc, item) => acc + item.quantity, 0),
    hasBulkPurchase: hasBulkPurchase(cart),
  });

  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <ShoppingBagIcon />
        장바구니
      </h2>
      {cart.length === 0 ? (
        <CartIsEmpty />
      ) : (
        <div className="space-y-3">
          {cart.map((item) => {
            const itemTotal = calculateItemTotal({
              item,
              discount,
            });
            const originalPrice = item.product.price * item.quantity;
            const hasDiscount = itemTotal < originalPrice;
            const discountRate = hasDiscount
              ? Math.round((1 - itemTotal / originalPrice) * 100)
              : 0;

            return (
              <CartItem
                item={item}
                itemTotal={itemTotal}
                hasDiscount={hasDiscount}
                discountRate={discountRate}
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}
                cart={cart}
                products={products}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
