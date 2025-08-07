import { ShoppingBagIcon } from "../../icons";
import { CartIsEmpty } from "./CartIsEmpty";
import { CartItem } from "./CartItem";
import { useCart } from "../../../hooks/useCart";

export function Cart() {
  const { cart } = useCart();

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
          {cart.map((item) => (
            <CartItem item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
