import { useCallback } from "react";
import { Coupon, DiscountType } from "@/types";
import { useLocalStorageObject } from "@shared";

const initialCoupons: Coupon[] = [
  {
    name: "5000원 할인",
    code: "AMOUNT5000",
    discountType: DiscountType.AMOUNT,
    discountValue: 5000,
  },
  {
    name: "10% 할인",
    code: "PERCENT10",
    discountType: DiscountType.PERCENTAGE,
    discountValue: 10,
  },
];

export function useCouponStore() {
  const [coupons, setCoupons] = useLocalStorageObject<Coupon[]>(
    "coupons",
    initialCoupons
  );

  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      setCoupons((prev) => [...prev, newCoupon]);
    },
    [setCoupons]
  );

  const deleteCoupon = useCallback(
    (code: string) => {
      setCoupons((prev) => prev.filter((coupon) => coupon.code !== code));
    },
    [setCoupons]
  );

  const findCouponByCode = useCallback(
    (code: string) => {
      return coupons.find((coupon) => coupon.code === code);
    },
    [coupons]
  );

  const isDuplicateCode = useCallback(
    (code: string) => {
      return coupons.some((coupon) => coupon.code === code);
    },
    [coupons]
  );

  return {
    coupons,
    setCoupons,
    addCoupon,
    deleteCoupon,
    findCouponByCode,
    isDuplicateCode,
  };
}
