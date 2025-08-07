import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { Coupon } from "../../types";
import { couponsAtom, selectedCouponAtom } from "../atoms/couponAtoms";
import { validateCouponApplication, validateCouponCode } from "../utils/couponUtils";
import { saveDataToStorage } from "../utils/localStorageUtils";
import { useNotification } from "./useNotification";

interface UseCouponProps {
  cartTotals: { totalBeforeDiscount: number; totalAfterDiscount: number };
}

export const useCoupon = ({ cartTotals }: UseCouponProps) => {
  /** 알림 표시 */
  const { showToast } = useNotification();

  /** 쿠폰 목록 - Jotai 사용 */
  const [coupons, setCoupons] = useAtom(couponsAtom);

  /** 선택된 쿠폰 - Jotai 사용 */
  const [selectedCoupon, setSelectedCoupon] = useAtom(selectedCouponAtom);

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
    [coupons, showToast, setCoupons]
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
    [selectedCoupon, showToast, setSelectedCoupon, setCoupons]
  );

  /** localStorage 동기화 */
  useEffect(() => {
    saveDataToStorage("coupons", coupons);
  }, [coupons]);

  return {
    selectedCoupon,
    setSelectedCoupon,
    applyCoupon,
    addCoupon,
    deleteCoupon,
  };
};
