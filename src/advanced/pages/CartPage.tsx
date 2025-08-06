import { ProductListSection } from "../components/ui/cart/ProductListSection";
import { CartSection } from "../components/ui/cart/CartSection";
import { CouponSection } from "../components/ui/cart/CouponSection";
import { PaymentSummarySection } from "../components/ui/cart/PaymentSummarySection";
import { useCartHandlers } from "../entities/cart/useCartHandlers";
import { useNotifications } from "../hooks/useNotifications";

export const CartPage = () => {
  const { addNotification } = useNotifications();
  const cartHandlers = useCartHandlers({ addNotification });

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <ProductListSection />
      </div>
      <div className="lg:col-span-1 space-y-6">
        <CartSection />
        {cartHandlers.state.items.length > 0 && (
          <>
            <CouponSection />
            <PaymentSummarySection />
          </>
        )}
      </div>
    </div>
  );
};
