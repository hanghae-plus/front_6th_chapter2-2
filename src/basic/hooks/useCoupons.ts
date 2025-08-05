import { useEffect, useCallback } from "react";
import { Coupon } from "../../types";
import { initialCoupons } from "../data";
import { useLocalStorage } from "./useLocalStorage";

export function useCoupons() {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>(
    "coupons",
    initialCoupons
  );

  useEffect(() => {
    localStorage.setItem("coupons", JSON.stringify(coupons));
  }, [coupons]);

  const addCoupon = useCallback(
    (
      newCoupon: Coupon,
      addNotification: (
        message: string,
        type?: "error" | "success" | "warning"
      ) => void
    ) => {
      const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
      if (existingCoupon) {
        addNotification("이미 존재하는 쿠폰 코드입니다.", "error");
        return;
      }
      setCoupons((prev) => [...prev, newCoupon]);
      addNotification("쿠폰이 추가되었습니다.", "success");
    },
    [coupons, setCoupons]
  );

  const removeCoupon = useCallback(
    (
      couponCode: string,
      selectedCoupon: Coupon | null,
      setSelectedCoupon: (coupon: Coupon | null) => void,
      addNotification: (
        message: string,
        type?: "error" | "success" | "warning"
      ) => void
    ) => {
      setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }
      addNotification("쿠폰이 삭제되었습니다.", "success");
    },
    [setCoupons]
  );

  return {
    coupons,
    addCoupon,
    removeCoupon,
  };
}
