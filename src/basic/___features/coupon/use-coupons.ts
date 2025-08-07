import { useCallback } from "react";
import { Coupon } from "../../../types";
import { useLocalStorage } from "../../_shared/utility-hooks/use-local-storage";
import { initialCoupons } from "./mock";
import { AlreadyExistsCouponCodeError } from "../../__models/coupon/error";

export const useCoupons = () => {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>(
    "coupons",
    initialCoupons
  );

  const addCoupon = useCallback((newCoupon: Coupon) => {
    const existingCoupon = coupons.find((c) => c.code === newCoupon.code);

    if (existingCoupon) {
      throw new AlreadyExistsCouponCodeError();
    }

    setCoupons((prev) => [...prev, newCoupon]);
  }, []);

  const removeCoupon = useCallback((couponCode: Coupon["code"]) => {
    setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
  }, []);

  return {
    coupons,
    addCoupon,
    removeCoupon,
  };
};
