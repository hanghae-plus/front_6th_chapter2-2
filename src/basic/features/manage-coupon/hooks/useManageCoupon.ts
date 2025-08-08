import { useState, useCallback } from "react";
import { Coupon } from "@entities/coupon";
import type { Cart } from "@entities/cart/types";
import { getCartDiscountSummary } from "@entities/cart";
import { useCoupon, CouponErrorReason } from "@entities/coupon";
import { useGlobalNotification } from "@entities/notification";

export function useManageCoupon(cart: Cart[]) {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const { showErrorNotification, showSuccessNotification } =
    useGlobalNotification();

  const { coupons, applyCoupon: applyCouponLogic } = useCoupon({
    onApplyCouponError: (_, reason) => {
      if (reason === CouponErrorReason.INSUFFICIENT_AMOUNT) {
        showErrorNotification(
          "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다."
        );
      }
    },
  });

  const getCartSummaryWithCoupon = useCallback(() => {
    return getCartDiscountSummary(cart, selectedCoupon);
  }, [cart, selectedCoupon]);

  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const { totalAfterDiscount } = getCartSummaryWithCoupon();

      applyCouponLogic(coupon, totalAfterDiscount, (appliedCoupon) => {
        setSelectedCoupon(appliedCoupon);
        showSuccessNotification("쿠폰이 적용되었습니다.");
      });
    },
    [applyCouponLogic, getCartSummaryWithCoupon, showSuccessNotification]
  );

  const removeCoupon = useCallback(() => {
    setSelectedCoupon(null);
  }, []);

  return {
    selectedCoupon,
    coupons,

    applyCoupon,
    removeCoupon,

    getCartSummaryWithCoupon,
  };
}
