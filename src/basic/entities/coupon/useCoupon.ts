import { useCallback, useState } from "react";
import { CartItem } from "../../../types";
import { CouponWithUI } from "./coupon.types";
import { initialCoupons } from "./constants";
import { calculateCartTotal } from "../../utils/calculateCartTotal";
import { useLocalStorageState } from "../../utils/hooks/useLocalStorageState";
import { couponModel } from "./coupon.model";
import { ActionResult } from "../../types/common";

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
          message: "이미 존재하는 쿠폰 코드입니다.",
          type: "error",
        };
      }

      setCoupons((prev) => couponModel.addCoupon(prev, newCoupon));
      return {
        success: true,
        message: "쿠폰이 추가되었습니다.",
        type: "success",
      };
    },
    [coupons]
  );

  const deleteCoupon = useCallback(
    (couponCode: string): ActionResult => {
      setCoupons((prev) => couponModel.deleteCoupon(prev, couponCode));
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }
      return {
        success: true,
        message: "쿠폰이 삭제되었습니다.",
        type: "success",
      };
    },
    [selectedCoupon]
  );

  const applyCoupon = useCallback(
    (coupon: CouponWithUI, cart: CartItem[]): ActionResult => {
      const currentTotal = calculateCartTotal(
        cart,
        selectedCoupon
      ).totalAfterDiscount;

      if (!couponModel.canApplyCoupon(coupon, currentTotal)) {
        return {
          success: false,
          message: "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.",
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
    [selectedCoupon]
  );

  return {
    coupons,
    setCoupons,
    addCoupon,
    deleteCoupon,
    selectedCoupon,
    setSelectedCoupon,
    applyCoupon,
  };
};
