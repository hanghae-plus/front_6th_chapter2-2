import { ProductWithUI } from "../entities/products/product.types";
import { CartItem } from "../../types";
import { calculateCartTotal } from "../utils/calculateCartTotal";
import { useCouponHandlers } from "../entities/coupon/useCouponHandlers";
import { useOrderHandlers } from "../hooks/useOrderHandlers";
import { ProductListSection } from "../components/ui/cart/ProductListSection";
import { CartSection } from "../components/ui/cart/CartSection";
import { CouponSection } from "../components/ui/cart/CouponSection";
import { PaymentSummarySection } from "../components/ui/cart/PaymentSummarySection";
import { NotificationType } from "../types/common";

interface CartPageProps {
  products: ProductWithUI[];
  filteredProducts: ProductWithUI[];
  debouncedSearchTerm: string;
  cart: CartItem[];
  checkSoldOutByProductId: (productId: string) => boolean;
  addToCart: (product: ProductWithUI) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  onClearCart: () => void;
  addNotification: (message: string, type?: NotificationType) => void;
}

export const CartPage = ({
  products,
  filteredProducts,
  debouncedSearchTerm,
  cart,
  checkSoldOutByProductId,
  addToCart,
  removeFromCart,
  updateQuantity,
  onClearCart,
  addNotification,
}: CartPageProps) => {
  // Coupon 핸들러들을 내부에서 관리 (네임스페이스 구조 활용)
  const couponHandlers = useCouponHandlers({ addNotification });

  // Order 핸들러를 내부에서 관리 (네임스페이스 구조 활용)
  const orderHandlers = useOrderHandlers({
    addNotification,
    cartActions: {
      clear: onClearCart,
    },
    couponActions: {
      clearSelected: couponHandlers.actions.clearSelected,
    },
  });

  // totals를 별도로 계산
  const totals = calculateCartTotal(cart, couponHandlers.state.selected);

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
                coupons={couponHandlers.state.items}
                selectedCoupon={couponHandlers.state.selected}
                onCouponSelect={couponHandlers.actions.setSelected}
                onCouponApply={couponHandlers.actions.apply}
                cart={cart}
              />

              <PaymentSummarySection
                totals={totals}
                completeOrder={orderHandlers.actions.complete}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
