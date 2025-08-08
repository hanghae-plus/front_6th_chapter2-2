import type { Dispatch, SetStateAction } from "react";

import type { Coupon } from "../types";
import { validateCouponCode, validateCouponUsage } from "../utils";

interface UseCouponActionsParams {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  setCoupons: Dispatch<SetStateAction<Coupon[]>>;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  addNotification: (message: string, type?: "error" | "success" | "warning") => void;
}

export function useCouponActions({
  coupons,
  selectedCoupon,
  setCoupons,
  setSelectedCoupon,
  addNotification
}: UseCouponActionsParams) {
  const addCoupon = (newCoupon: Coupon) => {
    const validation = validateCouponCode(newCoupon.code, coupons);
    if (!validation.valid) {
      addNotification(validation.message, "error");
      return;
    }
    setCoupons((prev) => [...prev, newCoupon]);
    addNotification("쿠폰이 추가되었습니다.", "success");
  };

  const deleteCoupon = (couponCode: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
    if (selectedCoupon?.code === couponCode) {
      setSelectedCoupon(null);
    }
    addNotification("쿠폰이 삭제되었습니다.", "success");
  };

  const applyCoupon = (coupon: Coupon, totalAmount?: number) => {
    // totalAmount가 제공되지 않으면 기본 검증 없이 적용
    if (totalAmount !== undefined) {
      const validation = validateCouponUsage(coupon, totalAmount);
      if (!validation.valid) {
        addNotification(validation.message, "error");
        return;
      }
    }

    setSelectedCoupon(coupon);
    addNotification("쿠폰이 적용되었습니다.", "success");
  };

  const handleCouponSubmit = (
    couponForm: Coupon,
    resetForm: () => void,
    setShowForm: (show: boolean) => void
  ) => {
    addCoupon(couponForm);
    resetForm();
    setShowForm(false);
  };

  return {
    addCoupon,
    deleteCoupon,
    applyCoupon,
    handleCouponSubmit
  };
}
