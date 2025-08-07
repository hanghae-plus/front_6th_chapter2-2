// TODO: 쿠폰 관리 Hook
// 힌트:
// 1. 쿠폰 목록 상태 관리 (localStorage 연동 고려)
// 2. 쿠폰 추가/삭제
//
// 반환할 값:
// - coupons: 쿠폰 배열
// - addCoupon: 새 쿠폰 추가
// - removeCoupon: 쿠폰 삭제

import { useCallback, useEffect, useState } from "react";
import { Coupon } from "../../types";
import { initialCoupons } from "../constants";
import { addCoupon, deleteCoupon } from "../models/coupon";

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
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem("coupons");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialCoupons;
      }
    }
    return initialCoupons;
  });

  // TODO: 구현
  useEffect(() => {
    localStorage.setItem("coupons", JSON.stringify(coupons));
  }, [coupons]);

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
