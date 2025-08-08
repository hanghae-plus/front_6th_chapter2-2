import { useCart } from "../../../hooks/useCart";
import { BasketIcon } from "../../../components/icons";
import { CartItem } from "../../../components/cart/CartItem";

const CartSection = () => {
  const { cart } = useCart();

  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <BasketIcon className="w-5 h-5 mr-2" />
        장바구니
      </h2>

      {cart.length === 0 ? (
        <div className="text-center py-8">
          <BasketIcon
            strokeWidth={1}
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
          />
          <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cart.map((item) => (
            <CartItem key={item.product.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
};

export default CartSection;
