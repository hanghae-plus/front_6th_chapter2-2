import { useCallback } from "react";
import { CartItem } from "../../../types";
import { CouponWithUI } from "./coupon.types";
import { useCoupon } from "./useCoupon";
import { BaseHandlerProps } from "../../types/common";

interface UseCouponHandlersProps extends BaseHandlerProps {}

/**
 * 쿠폰 관련 핸들러들을 제공하는 훅
 */
export const useCouponHandlers = ({
  addNotification,
}: UseCouponHandlersProps) => {
  const {
    coupons,
    selectedCoupon,
    setSelectedCoupon,
    addCoupon: addCouponAction,
    deleteCoupon: deleteCouponAction,
    applyCoupon: applyCouponAction,
    clearSelectedCoupon,
    findCoupon,
  } = useCoupon();

  const addCoupon = useCallback(
    (newCoupon: Omit<CouponWithUI, "id">) => {
      const result = addCouponAction(newCoupon);
      addNotification(result.message, result.type);
    },
    [addCouponAction, addNotification]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      const result = deleteCouponAction(couponCode);
      addNotification(result.message, result.type);
    },
    [deleteCouponAction, addNotification]
  );

  const applyCoupon = useCallback(
    (coupon: CouponWithUI, cart: CartItem[]) => {
      const result = applyCouponAction(coupon, cart);
      addNotification(result.message, result.type);
    },
    [applyCouponAction, addNotification]
  );

  return {
    coupons,
    selectedCoupon,
    setSelectedCoupon,
    addCoupon,
    deleteCoupon,
    applyCoupon,
    clearSelectedCoupon,
    findCoupon,
  };
};
