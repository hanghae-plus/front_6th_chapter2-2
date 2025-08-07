import { useAtomValue, useSetAtom } from "jotai";

import couponAtom from "@/advanced/features/coupon/atoms/coupon.atom";

export function useCoupon() {
  const coupons = useAtomValue(couponAtom.coupons);
  const addCoupon = useSetAtom(couponAtom.addCoupon);
  const deleteCoupon = useSetAtom(couponAtom.deleteCoupon);
  const resetCoupon = useSetAtom(couponAtom.resetCoupon);

  const selectedCoupon = useAtomValue(couponAtom.selectedCoupon);
  const setSelectedCoupon = useSetAtom(couponAtom.setSelectedCoupon);

  return {
    coupons,
    addCoupon,
    deleteCoupon,
    selectedCoupon,
    setSelectedCoupon,
    resetCoupon,
  };
}
