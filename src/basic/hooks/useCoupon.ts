import { useState, useCallback, useEffect } from "react";
import { Coupon } from "../../types";
import { initialCoupons } from "../constants/data";
import { useNotification } from "./useNotification";
import { loadDataFromStorage, saveDataToStorage } from "../utils/localStorageUtils";
import { validateCouponApplication, validateCouponCode } from "../utils/couponUtils";

interface UseCouponProps {
  cartTotals: { totalBeforeDiscount: number; totalAfterDiscount: number };
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
}

export const useCoupon = ({ cartTotals, selectedCoupon, setSelectedCoupon }: UseCouponProps) => {
  /** 알림 표시 */
  const { showToast } = useNotification();

  /** 쿠폰 목록 */
  const [coupons, setCoupons] = useState<Coupon[]>(loadDataFromStorage<Coupon[]>("coupons", initialCoupons));

  /** 쿠폰 적용 */
  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = cartTotals.totalAfterDiscount;
      // 쿠폰 적용 가능 여부 검증
      if (!validateCouponApplication(coupon, currentTotal)) return showToast("percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.", "error");

      // 쿠폰 적용 허용
      setSelectedCoupon(coupon);
      showToast("쿠폰이 적용되었습니다.", "success");
    },
    [showToast, cartTotals, setSelectedCoupon]
  );

  /** 쿠폰 추가 */
  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      // 쿠폰 코드 중복 검증
      if (!validateCouponCode(newCoupon, coupons)) return showToast("이미 존재하는 쿠폰 코드입니다.", "error");
      setCoupons((prev) => [...prev, newCoupon]);
      showToast("쿠폰이 추가되었습니다.", "success");
    },
    [coupons, showToast]
  );

  /** 쿠폰 삭제 */
  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((c) => c.code !== couponCode));

      //선택된 쿠폰이라면 선택 초기화
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }

      showToast("쿠폰이 삭제되었습니다.", "success");
    },
    [selectedCoupon, showToast, setSelectedCoupon]
  );

  /** localStorage 동기화 */
  useEffect(() => {
    saveDataToStorage("coupons", coupons);
  }, [coupons]);

  return {
    coupons,
    applyCoupon,
    addCoupon,
    deleteCoupon,
  };
};
