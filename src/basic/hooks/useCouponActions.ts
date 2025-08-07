import { useCallback } from "react";
import { useCoupon } from "./useCoupon";
import cartService from "../services/cart";

interface CouponActionCallbacks {
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

export function useCouponActions(callbacks?: CouponActionCallbacks) {
  const {
    selectedCoupon,
    coupons,
    applyCoupon: applyCouponOriginal,
    addCoupon: addCouponOriginal,
    deleteCoupon: deleteCouponOriginal,
    clearSelectedCoupon: clearSelectedCouponOriginal,
  } = useCoupon();

  const applyCoupon = useCallback(
    (coupon: any, cart: any[]) => {
      const cartTotal = cartService.calculateCartTotal({
        cart,
        selectedCoupon: null, // 쿠폰 적용 전 총액 계산
      }).totalAfterDiscount;

      const result = applyCouponOriginal(coupon, cartTotal);

      if (result.isValid) {
        callbacks?.onSuccess?.("쿠폰이 적용되었습니다");
      } else {
        callbacks?.onError?.(result.message);
      }

      return result;
    },
    [applyCouponOriginal, callbacks]
  );

  const addCoupon = useCallback(
    (coupon: any) => {
      const result = addCouponOriginal(coupon);
      
      if (result.status === "success") {
        callbacks?.onSuccess?.("쿠폰이 추가되었습니다");
      } else {
        callbacks?.onError?.(result.message);
      }
      
      return result;
    },
    [addCouponOriginal, callbacks]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      const result = deleteCouponOriginal(couponCode);
      
      if (result.status === "success") {
        callbacks?.onSuccess?.("쿠폰이 삭제되었습니다");
      } else {
        callbacks?.onError?.(result.message);
      }
      
      return result;
    },
    [deleteCouponOriginal, callbacks]
  );

  const clearSelectedCoupon = useCallback(() => {
    clearSelectedCouponOriginal();
    callbacks?.onSuccess?.("쿠폰이 해제되었습니다");
  }, [clearSelectedCouponOriginal, callbacks]);

  return {
    selectedCoupon,
    coupons,
    applyCoupon,
    addCoupon,
    deleteCoupon,
    clearSelectedCoupon,
  };
} 