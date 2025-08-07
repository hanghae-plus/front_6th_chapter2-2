// TODO: 쿠폰 관리 Hook
// 힌트:
// 1. 쿠폰 목록 상태 관리 (localStorage 연동 고려)
// 2. 쿠폰 추가/삭제
//
// 반환할 값:
// - coupons: 쿠폰 배열
// - addCoupon: 새 쿠폰 추가
// - removeCoupon: 쿠폰 삭제

import { useCallback } from "react";
import { Coupon } from "../../types";
import { initialCoupons } from "../constants";
import { addCoupon, deleteCoupon } from "../models/coupon";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";

export function useCoupons({
  addNotification,
  selectedCoupon,
  setSelectedCoupon,
}: {
  addNotification: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
}) {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>(
    "coupons",
    initialCoupons
  );

  const applyAddCoupon = useCallback(
    (newCoupon: Coupon) => {
      const result = addCoupon({ newCoupon, coupons });
      setCoupons(result.coupons);
      addNotification(result.message, "success");
    },
    [coupons, addNotification]
  );

  const applyDeleteCoupon = useCallback(
    (couponCode: string) => {
      const result = deleteCoupon({ couponCode, coupons, selectedCoupon });
      setCoupons(result.coupons);
      if (result.resetSelectedCoupon) {
        setSelectedCoupon(null);
      }
      addNotification(result.message, "success");
    },
    [selectedCoupon, addNotification, coupons, setSelectedCoupon]
  );

  return {
    coupons,
    applyAddCoupon,
    applyDeleteCoupon,
  };
}
