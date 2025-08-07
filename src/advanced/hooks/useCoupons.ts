// 쿠폰 관리 Hook
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
import { addCoupon, deleteCoupon } from "../models/coupon";
import { useNotification } from "../utils/hooks/useNotification";
import { useAtom } from "jotai";
import { couponsAtom, selectedCouponAtom } from "../atoms";

export function useCoupons() {
  const { addNotification } = useNotification();
  const [selectedCoupon, setSelectedCoupon] = useAtom(selectedCouponAtom);
  const [coupons, setCoupons] = useAtom(couponsAtom);

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
