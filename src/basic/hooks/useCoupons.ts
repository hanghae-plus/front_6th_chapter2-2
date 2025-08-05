import { useState, useEffect, useCallback } from "react";
import { Coupon } from "../../types";

const initialCoupons: Coupon[] = [
  {
    name: "5000원 할인",
    code: "AMOUNT5000",
    discountType: "amount",
    discountValue: 5000,
  },
  {
    name: "10% 할인",
    code: "PERCENT10",
    discountType: "percentage",
    discountValue: 10,
  },
];

export const useCoupons = () => {
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

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
      if (existingCoupon) {
        throw new Error("이미 존재하는 쿠폰 코드입니다.");
      }
      setCoupons((prev) => [...prev, newCoupon]);
    },
    [coupons]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }
    },
    [selectedCoupon]
  );

  const applyCoupon = useCallback((coupon: Coupon, currentTotal: number) => {
    if (currentTotal < 10000 && coupon.discountType === "percentage") {
      throw new Error("percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.");
    }
    setSelectedCoupon(coupon);
  }, []);

  // localStorage에 쿠폰 저장
  useEffect(() => {
    localStorage.setItem("coupons", JSON.stringify(coupons));
  }, [coupons]);

  return {
    coupons,
    selectedCoupon,
    addCoupon,
    deleteCoupon,
    applyCoupon,
    setSelectedCoupon,
  };
};
