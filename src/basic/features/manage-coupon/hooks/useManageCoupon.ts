import { useState, useCallback } from "react";
import { Coupon } from "@entities/coupon";
import { useCoupon, CouponErrorReason } from "@entities/coupon";
import { useGlobalNotification } from "@entities/notification";

export function useManageCoupon() {
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

  const applyCoupon = useCallback(
    (coupon: Coupon, totalAfterDiscount: number) => {
      applyCouponLogic(coupon, totalAfterDiscount, (appliedCoupon) => {
        setSelectedCoupon(appliedCoupon);
        showSuccessNotification("쿠폰이 적용되었습니다.");
      });
    },
    [applyCouponLogic, showSuccessNotification]
  );

  const removeCoupon = useCallback(() => {
    setSelectedCoupon(null);
  }, []);

  return {
    selectedCoupon,
    coupons,
    applyCoupon,
    removeCoupon,
  };
}
