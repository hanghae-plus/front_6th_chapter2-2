import { ProductWithUI } from "../entities/products/product.types";
import { CartItem, Coupon } from "../../types";
import { formatPrice } from "../utils/formatters";
import { calculateRemainingStock } from "../utils/calculateRemainingStock";
import { calculateItemTotal } from "../utils/calculateItemTotal";
import { calculateCartTotal } from "../utils/calculateCartTotal";
import { useCouponHandlers } from "../entities/coupon/useCouponHandlers";
import { useOrderHandlers } from "../hooks/useOrderHandlers";
import { ProductListSection } from "../components/ui/cart/ProductListSection";
import { CartSection } from "../components/ui/cart/CartSection";
import { CouponSection } from "../components/ui/cart/CouponSection";
import { PaymentSummarySection } from "../components/ui/cart/PaymentSummarySection";

interface CartPageProps {
  products: ProductWithUI[];
  filteredProducts: ProductWithUI[];
  debouncedSearchTerm: string;
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  checkSoldOutByProductId: (productId: string) => boolean;
  isAdmin: boolean;
  // Cart 핸들러들은 전역에서 받음
  addToCart: (product: ProductWithUI) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  addNotification: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
}

export const CartPage = ({
  products,
  filteredProducts,
  debouncedSearchTerm,
  cart,
  setCart,
  checkSoldOutByProductId,
  isAdmin,
  addToCart,
  removeFromCart,
  updateQuantity,
  addNotification,
}: CartPageProps) => {
  // Coupon 핸들러들을 내부에서 관리
  const { coupons, selectedCoupon, setSelectedCoupon, applyCoupon } =
    useCouponHandlers({ addNotification });

  // Order 핸들러를 내부에서 관리
  const { completeOrder } = useOrderHandlers({
    addNotification,
    setCart,
    setSelectedCoupon,
  });

  // totals를 별도로 계산
  const totals = calculateCartTotal(cart, selectedCoupon);

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
