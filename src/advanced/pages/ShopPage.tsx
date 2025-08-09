import { useCallback, useState } from "react";
import { Coupon, Product } from "../../types";

import { ProductList } from "../components/product/ProductList";
import { calculateCartTotal, getRemainingStock } from "../utils/cartUtils";
import { CartSection } from "../components/cart/CartSection";
import { CouponSection } from "../components/coupon/CouponSection";
import { PaymentSection } from "../components/payment/PaymentSection";
import { useCart } from "../hooks/useCart";
import { useNotifications } from "../hooks/useNotifications";

export function ShopPage() {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const { cart } = useCart();
  const { addNotification } = useNotifications();

  // 쿠폰 적용
  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = calculateCartTotal(
        cart,
        selectedCoupon
      ).totalBeforeDiscount;

      if (currentTotal < 10000 && coupon.discountType === "percentage") {
        addNotification(
          "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.",
          "error"
        );
        return;
      }

      setSelectedCoupon(coupon);
      addNotification("쿠폰이 적용되었습니다.", "success");
    },
    [addNotification, cart, selectedCoupon, setSelectedCoupon]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        {/* 상품 목록 */}
        <ProductList />
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <CartSection />

          {cart.length > 0 && (
            <>
              <CouponSection
                selectedCoupon={selectedCoupon}
                setSelectedCoupon={setSelectedCoupon}
                applyCoupon={applyCoupon}
              />

              <PaymentSection
                selectedCoupon={selectedCoupon}
                setSelectedCoupon={setSelectedCoupon}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
