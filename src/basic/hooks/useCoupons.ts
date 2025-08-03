import { useState, useEffect, useCallback } from "react";
import { Coupon } from "../types";
import { INITIAL_COUPONS } from "../constants";
import * as couponModel from "../models/coupon";

// 최종: 모든 쿠폰 관련 로직을 포함한 완전한 훅
export function useCoupons(
  getTotals: (selectedCoupon: any) => { totalBeforeDiscount: number; totalAfterDiscount: number },
  addNotification?: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void
) {
  // 쿠폰 목록 상태 (localStorage에서 복원)
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem("coupons");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_COUPONS;
      }
    }
    return INITIAL_COUPONS;
  });

  // 선택된 쿠폰 상태
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // localStorage 동기화
  useEffect(() => {
    localStorage.setItem("coupons", JSON.stringify(coupons));
  }, [coupons]);

  // 계산 함수들 (필요할 때 cartTotal을 받아서 처리)
  const getAvailableCoupons = useCallback(
    (cartTotal: number) => {
      return coupons.filter((coupon) => {
        const validation = couponModel.validateCouponUsage(coupon, cartTotal);
        return validation.canUse;
      });
    },
    [coupons]
  );

  // 3단계: 상태 변경 함수들
  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      if (couponModel.checkDuplicateCoupon(coupons, newCoupon.code)) {
        addNotification?.("이미 존재하는 쿠폰 코드입니다.", "error");
        return;
      }
      setCoupons((prev) => couponModel.addCouponToList(prev, newCoupon));
      addNotification?.("쿠폰이 추가되었습니다.", "success");
    },
    [coupons, addNotification]
  );

  const removeCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => couponModel.removeCouponFromList(prev, couponCode));
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }
      addNotification?.("쿠폰이 삭제되었습니다.", "success");
    },
    [addNotification, selectedCoupon]
  );

  const applyCoupon = useCallback(
    (coupon: Coupon | null) => {
      if (!coupon) {
        setSelectedCoupon(null);
        return;
      }

      // 현재 장바구니 총액 계산 (쿠폰 없이)
      const currentTotal = getTotals(null).totalAfterDiscount;
      const validation = couponModel.validateCouponUsage(coupon, currentTotal);
      if (!validation.canUse) {
        addNotification?.(validation.reason!, "error");
        return;
      }

      setSelectedCoupon(coupon);
      addNotification?.("쿠폰이 적용되었습니다.", "success");
    },
    [getTotals, addNotification]
  );

  return {
    coupons,
    selectedCoupon,
    getAvailableCoupons,
    addCoupon,
    removeCoupon,
    applyCoupon,
  };
}
