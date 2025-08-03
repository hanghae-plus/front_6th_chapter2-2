import { useState, useEffect } from "react";
import { Coupon } from "../types";
import { INITIAL_COUPONS } from "../constants";

// 1단계: 기본 상태 관리만
export function useCoupons() {
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

  // localStorage 동기화
  useEffect(() => {
    localStorage.setItem("coupons", JSON.stringify(coupons));
  }, [coupons]);

  return { coupons, setCoupons };
}