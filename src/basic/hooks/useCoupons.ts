import { useState } from "react";
import { Coupon } from "../../types";
import { initialCoupons } from "../data";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";

export const useCoupons = () => {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>({
    key: "coupons",
    initialValue: initialCoupons,
  });

  const addCoupon = (newCoupon: Coupon) => {
    const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
    if (existingCoupon) {
      throw Error("이미 존재하는 쿠폰 코드입니다.");
    }

    setCoupons((prev) => [...prev, newCoupon]);
  };

  const deleteCoupon = (couponCode: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
  };

  return {
    coupons,
    addCoupon,
    deleteCoupon,
  };
};
