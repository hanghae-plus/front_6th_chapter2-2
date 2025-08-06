import { useCallback } from "react";
import { CartItem } from "../../../types";
import { CouponWithUI } from "./coupon.types";
import { useCoupon } from "./useCoupon";

interface UseCouponHandlersProps {
  addNotification: (
    message: string,
    type: "success" | "error" | "warning"
  ) => void;
}

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
  } = useCoupon();

  const addCoupon = useCallback(
    (newCoupon: Omit<CouponWithUI, "id">) => {
      const result = addCouponAction(newCoupon);
      if (result.type) {
        addNotification(result.message, result.type);
      }
    },
    [addCouponAction, addNotification]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      const result = deleteCouponAction(couponCode);
      if (result.type) {
        addNotification(result.message, result.type);
      }
    },
    [deleteCouponAction, addNotification]
  );

  const applyCoupon = useCallback(
    (coupon: CouponWithUI, cart: CartItem[]) => {
      const result = applyCouponAction(coupon, cart);
      if (result.type) {
        addNotification(result.message, result.type);
      }
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
  };
};
