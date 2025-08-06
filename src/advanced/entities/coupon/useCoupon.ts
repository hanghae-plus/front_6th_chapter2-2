import { useCallback } from "react";
import { useAtom } from "jotai";
import { CartItem } from "../../../types";
import { CouponWithUI } from "./coupon.types";
import { couponsAtom, selectedCouponAtom } from "../../atoms";
import { calculateCartTotal } from "../../utils/calculateCartTotal";
import { couponModel } from "./coupon.model";
import { ActionResult } from "../../types/common";
import { MESSAGES } from "../../constants";

/**
 * 쿠폰 상태 관리 훅 (내부적으로 Jotai 사용)
 */
export const useCoupon = () => {
  const [coupons, setCoupons] = useAtom(couponsAtom);
  const [selectedCoupon, setSelectedCoupon] = useAtom(selectedCouponAtom);

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
    [coupons, setCoupons]
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
    [selectedCoupon, coupons, setCoupons, setSelectedCoupon]
  );

  const applyCoupon = useCallback(
    (coupon: CouponWithUI, cart: CartItem[]): ActionResult => {
      const result = calculateCartTotal(cart, coupon);

      if (result.discountAmount <= 0) {
        return {
          success: false,
          message: "쿠폰을 적용할 수 없습니다.",
          type: "warning",
        };
      }

      setSelectedCoupon(coupon);

      return {
        success: true,
        message: "쿠폰이 적용되었습니다.",
        type: "success",
      };
    },
    [setSelectedCoupon]
  );

  const clearSelectedCoupon = useCallback(() => {
    setSelectedCoupon(null);
  }, [setSelectedCoupon]);

  const findCoupon = useCallback(
    (couponCode: string): CouponWithUI | undefined => {
      return couponModel.findCouponByCode(coupons, couponCode);
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
