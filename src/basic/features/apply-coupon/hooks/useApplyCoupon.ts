import { useState, useCallback } from "react";
import { Coupon, type CartItem } from "../../../../types";
import { getCartDiscountSummary } from "../../../entities/cart/libs/cartCalculations";
import {
  useCoupon,
  CouponErrorReason,
} from "../../../entities/coupon/hooks/useCoupon";
import { useGlobalNotification } from "../../../entities/notification/hooks/useGlobalNotification";
import { NotificationVariant } from "../../../entities/notification/types";

export function useApplyCoupon(cart: CartItem[]) {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const { addNotification } = useGlobalNotification();

  const { coupons, applyCoupon: applyCouponLogic } = useCoupon({
    onApplyCouponError: (_, reason) => {
      if (reason === CouponErrorReason.INSUFFICIENT_AMOUNT) {
        addNotification(
          "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.",
          NotificationVariant.ERROR
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
        addNotification("쿠폰이 적용되었습니다.", NotificationVariant.SUCCESS);
      });
    },
    [applyCouponLogic, getCartSummaryWithCoupon, addNotification]
  );

  const removeCoupon = useCallback(() => {
    setSelectedCoupon(null);
  }, []);

  const clearCoupon = useCallback(() => {
    setSelectedCoupon(null);
  }, []);

  return {
    selectedCoupon,
    coupons,
    getCartSummaryWithCoupon,
    applyCoupon,
    removeCoupon,
    clearCoupon,
  };
}
