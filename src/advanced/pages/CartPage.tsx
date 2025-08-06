import { ProductWithUI } from "../entities/products/product.types";
import { CartItem } from "../../types";
import { calculateCartTotal } from "../utils/calculateCartTotal";
import { useProductHandlers } from "../entities/products/useProductHandlers";
import { useCartHandlers } from "../entities/cart/useCartHandlers";
import { useCouponHandlers } from "../entities/coupon/useCouponHandlers";
import { useSearchProduct } from "../entities/products/useSearchProduct";
import { useProductUtils } from "../entities/products/useProductUtils";
import { useOrderHandlers } from "../hooks/useOrderHandlers";
import { useNotifications } from "../hooks/useNotifications";
import { productModel } from "../entities/products/product.model";
import { ProductListSection } from "../components/ui/cart/ProductListSection";
import { CartSection } from "../components/ui/cart/CartSection";
import { CouponSection } from "../components/ui/cart/CouponSection";
import { PaymentSummarySection } from "../components/ui/cart/PaymentSummarySection";

export const CartPage = () => {
  // Hooks를 직접 사용
  const { addNotification } = useNotifications();
  const productHandlers = useProductHandlers({ addNotification });
  const cartHandlers = useCartHandlers({ addNotification });
  const couponHandlers = useCouponHandlers({ addNotification });
  const searchProduct = useSearchProduct();

  const productUtils = useProductUtils({
    products: productHandlers.state.items,
    cart: cartHandlers.state.items,
  });

  // Order 핸들러를 내부에서 관리 (네임스페이스 구조 활용)
  const orderHandlers = useOrderHandlers({
    addNotification,
    cartActions: {
      clear: cartHandlers.actions.clear,
    },
    couponActions: {
      clearSelected: couponHandlers.actions.clearSelected,
    },
  });

  // totals를 별도로 계산
  const totals = calculateCartTotal(
    cartHandlers.state.items,
    couponHandlers.state.selected
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <ProductListSection />
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <CartSection />

          {cartHandlers.state.items.length > 0 && (
            <>
              <CouponSection />

              <PaymentSummarySection />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
