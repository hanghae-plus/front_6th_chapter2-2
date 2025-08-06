import { useCallback, useState } from "react";
import { CartItem } from "../../../types";
import { CouponWithUI } from "./coupon.types";
import { initialCoupons } from "./coupon.constants";
import { calculateCartTotal } from "../../utils/calculateCartTotal";
import { useLocalStorageState } from "../../utils/hooks";
import { couponModel } from "./coupon.model";
import { ActionResult } from "../../types/common";
import { MESSAGES } from "../../constants";

/**
 * 쿠폰 상태 관리 훅
 */
export const useCoupon = () => {
  const [coupons, setCoupons] = useLocalStorageState<CouponWithUI[]>(
    "coupons",
    initialCoupons
  );

  const [selectedCoupon, setSelectedCoupon] = useState<CouponWithUI | null>(
    null
  );

  const addCoupon = useCallback(
    (newCoupon: Omit<CouponWithUI, "id">): ActionResult => {
      if (couponModel.isCouponExists(coupons, newCoupon.code)) {
        return {
          success: false,
          message: MESSAGES.ERROR.COUPON_EXISTS,
          type: "error",
        };
      }

      setCoupons((prev) => couponModel.addCoupon(prev, newCoupon));
      return {
        success: true,
        message: MESSAGES.SUCCESS.COUPON_ADDED,
        type: "success",
      };
    },
    [coupons]
  );

  const deleteCoupon = useCallback(
    (couponCode: string): ActionResult => {
      if (!couponModel.findCouponByCode(coupons, couponCode)) {
        return {
          success: false,
          message: "존재하지 않는 쿠폰입니다.",
          type: "error",
        };
      }

      setCoupons((prev) => couponModel.deleteCoupon(prev, couponCode));

      // 삭제된 쿠폰이 선택된 쿠폰이라면 선택 해제
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }

      return {
        success: true,
        message: MESSAGES.SUCCESS.COUPON_DELETED,
        type: "success",
      };
    },
    [selectedCoupon, coupons]
  );

  const applyCoupon = useCallback(
    (coupon: CouponWithUI, cart: CartItem[]): ActionResult => {
      const cartTotals = calculateCartTotal(cart, null);

      if (!couponModel.canApplyCoupon(coupon, cartTotals.totalBeforeDiscount)) {
        return {
          success: false,
          message: "쿠폰을 적용할 수 없습니다.",
          type: "error",
        };
      }

      setSelectedCoupon(coupon);
      return {
        success: true,
        message: "쿠폰이 적용되었습니다.",
        type: "success",
      };
    },
    []
  );

  const clearSelectedCoupon = useCallback(() => {
    setSelectedCoupon(null);
  }, []);

  const findCoupon = useCallback(
    (code: string): CouponWithUI | undefined => {
      return couponModel.findCouponByCode(coupons, code);
    },
    [coupons]
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
