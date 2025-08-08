import type { CartItem, Coupon, Product } from "../../../types";
import { calculateCartTotal, CartSidebar } from "../../domains/cart";
import { filterProducts, ProductList } from "../../domains/product";

interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

type CartPageProps = {
  products: ProductWithUI[];
  debouncedSearchTerm: string;
  getRemainingStock: (product: Product) => number;
  formatPrice: (price: number, productId?: string) => string;
  addToCart: (product: ProductWithUI) => void;
  cart: CartItem[];
  calculateItemTotal: (item: CartItem) => number;
  updateQuantity: (productId: string, newQuantity: number) => void;
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  applyCoupon: (coupon: Coupon) => void;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  completeOrder: () => void;
  removeFromCart: (productId: string) => void;
};

export function CartPage({
  addToCart,
  applyCoupon,
  calculateItemTotal,
  cart,
  completeOrder,
  coupons,
  debouncedSearchTerm,
  formatPrice,
  getRemainingStock,
  products,
  selectedCoupon,
  setSelectedCoupon,
  updateQuantity,
  removeFromCart
}: CartPageProps) {
  const filteredProducts = filterProducts(products, debouncedSearchTerm);
  const totals = calculateCartTotal(cart, selectedCoupon);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
      <div className="lg:col-span-3">
        <ProductList
          products={products}
          filteredProducts={filteredProducts}
          debouncedSearchTerm={debouncedSearchTerm}
          getRemainingStock={getRemainingStock}
          formatPrice={formatPrice}
          addToCart={addToCart}
        />
      </div>
      <div className="lg:col-span-1">
        <CartSidebar
          cart={cart}
          calculateItemTotal={calculateItemTotal}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          coupons={coupons}
          selectedCoupon={selectedCoupon}
          applyCoupon={applyCoupon}
          setSelectedCoupon={setSelectedCoupon}
          totals={totals}
          completeOrder={completeOrder}
        />
      </div>
    </div>
  );
}
