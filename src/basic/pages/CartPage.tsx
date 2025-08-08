import { CartItem, Coupon } from "../../types";
import { ProductWithUI } from "../App";
import { Cart } from "../components/cart/Cart";
import { ProductList } from "../components/product/ProductList";
import { CartTotal } from "../models/cart";

interface CartPageProps {
  products: ProductWithUI[];
  cart: CartItem[];
  selectedCoupon: Coupon | null;
  debouncedSearchTerm: string;
  coupons: Coupon[];
  setSelectedCoupon: (coupon: Coupon | null) => void;
  calculateTotal: (
    cart: CartItem[],
    selectedCoupon: Coupon | null
  ) => CartTotal;
  getProductPriceDisplay: (price: number, productId: string) => string;
  addToCart: (product: ProductWithUI) => void;
  removeFromCart: (productId: string) => void;
  calculateItemTotal: (item: CartItem, cart: CartItem[]) => number;
  updateQuantity: (productId: string, quantity: number) => void;
  applyCoupon: (coupon: Coupon) => void;
  completeOrder: () => void;
}

const CartPage = ({
  products,
  cart,
  selectedCoupon,
  debouncedSearchTerm,
  coupons,
  setSelectedCoupon,
  calculateTotal,
  getProductPriceDisplay,
  addToCart,
  removeFromCart,
  calculateItemTotal,
  updateQuantity,
  applyCoupon,
  completeOrder,
}: CartPageProps) => {
  const totals = calculateTotal(cart, selectedCoupon);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <ProductList
          products={products}
          cart={cart}
          debouncedSearchTerm={debouncedSearchTerm}
          getProductPriceDisplay={getProductPriceDisplay}
          onAddToCart={addToCart}
        />
      </div>
      <div className="lg:col-span-1">
        <Cart
          cart={cart}
          coupons={coupons}
          selectedCoupon={selectedCoupon}
          totals={totals}
          calculateItemTotal={calculateItemTotal}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
          setSelectedCoupon={setSelectedCoupon}
          applyCoupon={applyCoupon}
          completeOrder={completeOrder}
        />
      </div>
    </div>
  );
};

export default CartPage;
