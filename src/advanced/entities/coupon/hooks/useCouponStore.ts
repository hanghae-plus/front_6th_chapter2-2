import { useCallback } from "react";
import { useAtom } from "jotai";
import { couponsAtom } from "../model/atoms";
import type { Coupon } from "../types";

export function useCouponStore() {
  const [coupons, setCoupons] = useAtom(couponsAtom);

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
