import { useState, useCallback } from "react";
import { Coupon } from "../../types";
import { useLocalStorage } from "./useLocalStorage";
import { DuplicateCouponCodeError, CouponUsageConditionError } from "../errors/Coupon.error";

const initialCoupons: Coupon[] = [
  {
    name: "5000원 할인",
    code: "AMOUNT5000",
    discountType: "amount",
    discountValue: 5000,
  },
  {
    name: "10% 할인",
    code: "PERCENT10",
    discountType: "percentage",
    discountValue: 10,
  },
];

export const useCoupons = (addNotification?: (message: string, type?: "error" | "success" | "warning") => void) => {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>("coupons", initialCoupons);

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
      if (existingCoupon) {
        throw new DuplicateCouponCodeError(newCoupon.code);
      }
      setCoupons((prev) => [...prev, newCoupon]);
      addNotification?.("쿠폰이 추가되었습니다.", "success");
    },
    [coupons, addNotification]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }
      addNotification?.("쿠폰이 삭제되었습니다.", "success");
    },
    [selectedCoupon, addNotification]
  );

  const applyCoupon = useCallback((coupon: Coupon, currentTotal: number) => {
    if (currentTotal < 10000 && coupon.discountType === "percentage") {
      throw new CouponUsageConditionError(coupon.discountType, 10000);
    }
    addNotification?.("쿠폰이 적용되었습니다.", "success");
    setSelectedCoupon(coupon);
  }, []);

  return {
    coupons,
    selectedCoupon,
    addCoupon,
    deleteCoupon,
    applyCoupon,
    setSelectedCoupon,
  };
};
