import { useState } from "react";
import { Coupon } from "../../types";
import { initialCoupons } from "../constants";
import { useLocalStorageState } from "../utils/hooks/useLocalStorageState";

export function useCoupons() {
  const [coupons, setCoupons] = useLocalStorageState<Array<Coupon>>(
    "coupons",
    initialCoupons
  );

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const hasCoupon = (code: string) => {
    return coupons.some((c) => c.code === code);
  };

  const addCoupon = (newCoupon: Coupon, isCouponExists: boolean) => {
    if (isCouponExists) return false;
    setCoupons((prev) => [...prev, newCoupon]);
    return true;
  };

  const deleteCoupon = (couponCode: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
    if (selectedCoupon?.code === couponCode) {
      setSelectedCoupon(null);
    }
  };

  const applyCoupon = (coupon: Coupon, currentTotal: number) => {
    if (currentTotal < 10000 && coupon.discountType === "percentage")
      return false;
    setSelectedCoupon(coupon);
    return true;
  };
  return {
    coupons,
    selectedCoupon,
    setSelectedCoupon,
    hasCoupon,
    addCoupon,
    deleteCoupon,
    applyCoupon,
  };
}
