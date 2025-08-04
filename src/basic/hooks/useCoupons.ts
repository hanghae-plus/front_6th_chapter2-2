import { useState } from "react";
import type { Coupon } from "../../types";
import { initialCoupons } from "../data/coupons";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";

export function useCoupons() {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>(
    "coupons",
    initialCoupons
  );

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  return { coupons, setCoupons, selectedCoupon, setSelectedCoupon };
}
