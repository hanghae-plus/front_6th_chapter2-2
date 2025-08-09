import { useCallback } from "react";
import { Coupon } from "../../types";
import { initialCoupons } from "../constants/coupon";
import { generateCouponCode } from "../utils/couponUtils";
import { useLocalStorage } from "./useLocalStorage";

export const useCoupons = () => {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>(
    "coupons",
    initialCoupons
  );

  // 쿠폰 추가
  const addCoupon = useCallback(
    (couponData: Coupon) => {
      setCoupons((prev) => [...prev, couponData]);
      return couponData;
    },
    [setCoupons]
  );

  // 쿠폰 삭제
  const removeCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((coupon) => coupon.code !== couponCode));
    },
    [setCoupons]
  );

  // 쿠폰 코드로 쿠폰 찾기
  const getCouponByCode = useCallback(
    (code: string) => {
      return coupons.find((coupon) => coupon.code === code);
    },
    [coupons]
  );

  // 쿠폰 존재 여부 확인
  const isCouponExists = useCallback(
    (code: string) => {
      return coupons.some((coupon) => coupon.code === code);
    },
    [coupons]
  );

  // 쿠폰 목록 가져오기
  const getAllCoupons = useCallback(() => {
    return coupons;
  }, [coupons]);

  // 쿠폰 코드 자동 생성
  const generateUniqueCouponCode = useCallback(() => {
    let code: string;
    do {
      code = generateCouponCode();
    } while (isCouponExists(code));
    return code;
  }, [isCouponExists]);

  return {
    coupons,
    addCoupon,
    removeCoupon,

    getCouponByCode,
    isCouponExists,
    getAllCoupons,
    generateUniqueCouponCode,
  };
};
