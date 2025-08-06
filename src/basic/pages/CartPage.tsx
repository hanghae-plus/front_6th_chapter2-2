import { ProductWithUI } from "../entities/products/product.types";
import { CartItem, Coupon } from "../../types";
import { formatPrice } from "../utils/formatters";
import { calculateRemainingStock } from "../utils/calculateRemainingStock";
import { calculateItemTotal } from "../utils/calculateItemTotal";
import { useCouponHandlers } from "../entities/coupon/useCouponHandlers";
import { ProductListSection } from "../components/ui/cart/ProductListSection";
import { CartSection } from "../components/ui/cart/CartSection";
import { CouponSection } from "../components/ui/cart/CouponSection";
import { PaymentSummarySection } from "../components/ui/cart/PaymentSummarySection";

interface CartPageProps {
  products: ProductWithUI[];
  filteredProducts: ProductWithUI[];
  debouncedSearchTerm: string;
  cart: CartItem[];
  checkSoldOutByProductId: (productId: string) => boolean;
  isAdmin: boolean;
  // Cart 관련 props - 핸들러 함수들
  addToCart: (product: ProductWithUI) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  // Coupon 관련 props
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  applyCoupon: (coupon: Coupon, cart: CartItem[]) => void;
  // Order 관련 props
  completeOrder: () => void;
  totals: {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
}

export const CartPage = ({
  products,
  filteredProducts,
  debouncedSearchTerm,
  cart,
  checkSoldOutByProductId,
  isAdmin,
  addToCart,
  removeFromCart,
  updateQuantity,
  coupons,
  selectedCoupon,
  setSelectedCoupon,
  applyCoupon,
  completeOrder,
  totals,
}: CartPageProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <ProductListSection
          products={products}
          filteredProducts={filteredProducts}
          debouncedSearchTerm={debouncedSearchTerm}
          cart={cart}
          checkSoldOutByProductId={checkSoldOutByProductId}
          addToCart={addToCart}
        />
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <CartSection
            cart={cart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
          />

          {cart.length > 0 && (
            <>
              <CouponSection
                coupons={coupons}
                selectedCoupon={selectedCoupon}
                setSelectedCoupon={setSelectedCoupon}
                applyCoupon={applyCoupon}
                cart={cart}
              />

              <PaymentSummarySection
                totals={totals}
                completeOrder={completeOrder}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
