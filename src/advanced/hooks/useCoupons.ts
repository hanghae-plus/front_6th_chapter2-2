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
import { useAtom } from "jotai";
import { Coupon } from "../type/types";
import { couponsAtom } from "../stores";

interface UseCouponsProps {
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void;
}

/**
 * 쿠폰 관리 관련 상태와 로직을 관리하는 훅
 *
 * 주요 기능:
 * 1. 쿠폰 목록 상태 관리 (localStorage 연동)
 * 2. 쿠폰 추가/삭제/검증
 * 3. 쿠폰 적용 가능 여부 확인
 * 4. 쿠폰 할인 금액 계산
 *
 * @param addNotification 알림 메시지 표시 함수
 * @returns 쿠폰 관련 상태와 함수들
 */
export const useCoupons = ({ addNotification }: UseCouponsProps) => {
  // 쿠폰 목록 상태 (localStorage와 자동 동기화)
  const [coupons, setCoupons] = useAtom(couponsAtom);

  // 쿠폰 추가
  // 새로운 쿠폰을 목록에 추가하고 유효성 검증을 수행
  const addCoupon = useCallback(
    (newCoupon: Omit<Coupon, "id">) => {
      // 쿠폰 코드 중복 검사
      const isDuplicate = coupons.some(
        (coupon) => coupon.code === newCoupon.code
      );
      if (isDuplicate) {
        addNotification("이미 존재하는 쿠폰 코드입니다.", "error");
        return;
      }

      // 유효성 검증
      if (!newCoupon.name.trim()) {
        addNotification("쿠폰명을 입력해주세요.", "error");
        return;
      }
      if (!newCoupon.code.trim()) {
        addNotification("쿠폰 코드를 입력해주세요.", "error");
        return;
      }
      if (newCoupon.discountValue <= 0) {
        addNotification("할인 값은 0보다 커야 합니다.", "error");
        return;
      }
      if (
        newCoupon.discountType === "percentage" &&
        newCoupon.discountValue > 100
      ) {
        addNotification("퍼센트 할인은 100% 이하여야 합니다.", "error");
        return;
      }

      // 새 쿠폰 추가
      const couponToAdd: Coupon = {
        ...newCoupon,
      };

      setCoupons((prevCoupons) => [...prevCoupons, couponToAdd]);
      addNotification("쿠폰이 추가되었습니다.", "success");
    },
    [coupons, addNotification]
  );

  // 쿠폰 삭제
  // 쿠폰 코드로 쿠폰을 삭제
  const removeCoupon = useCallback(
    (couponCode: string) => {
      const couponExists = coupons.some((coupon) => coupon.code === couponCode);
      if (!couponExists) {
        addNotification("쿠폰을 찾을 수 없습니다.", "error");
        return;
      }

      setCoupons((prevCoupons) =>
        prevCoupons.filter((coupon) => coupon.code !== couponCode)
      );
      addNotification("쿠폰이 삭제되었습니다.", "success");
    },
    [coupons, addNotification]
  );

  // 쿠폰 검색
  // 쿠폰 코드로 쿠폰을 찾아 반환
  const findCoupon = useCallback(
    (couponCode: string): Coupon | undefined => {
      return coupons.find((coupon) => coupon.code === couponCode);
    },
    [coupons]
  );

  // 쿠폰 적용 가능 여부 확인
  // Origin 로직: percentage 쿠폰은 10,000원 이상 구매시만 사용 가능
  const canApplyCoupon = useCallback(
    (coupon: Coupon, totalAmount: number): boolean => {
      if (coupon.discountType === "percentage" && totalAmount < 10000) {
        return false;
      }
      return true;
    },
    []
  );

  // 쿠폰 할인 금액 계산
  // 쿠폰 종류에 따라 할인 금액을 계산하여 반환
  const calculateCouponDiscount = useCallback(
    (coupon: Coupon, totalAmount: number): number => {
      if (!canApplyCoupon(coupon, totalAmount)) {
        return 0;
      }

      if (coupon.discountType === "amount") {
        return Math.min(coupon.discountValue, totalAmount);
      } else {
        return Math.round(totalAmount * (coupon.discountValue / 100));
      }
    },
    [canApplyCoupon]
  );

  // 쿠폰 적용 후 최종 금액 계산
  // 할인 적용 후 최종 결제 금액을 계산
  const calculateFinalAmount = useCallback(
    (coupon: Coupon, totalAmount: number): number => {
      const discountAmount = calculateCouponDiscount(coupon, totalAmount);
      return Math.max(0, totalAmount - discountAmount);
    },
    [calculateCouponDiscount]
  );

  // 사용 가능한 쿠폰 목록 조회
  // 현재 주문 금액에 적용 가능한 쿠폰들만 필터링하여 반환
  const getApplicableCoupons = useCallback(
    (totalAmount: number): Coupon[] => {
      return coupons.filter((coupon) => canApplyCoupon(coupon, totalAmount));
    },
    [coupons, canApplyCoupon]
  );

  return {
    // 상태값
    coupons,

    // 쿠폰 관리 함수들
    addCoupon,
    removeCoupon,
    findCoupon,

    // 쿠폰 검증 함수들
    canApplyCoupon,
    getApplicableCoupons,

    // 쿠폰 계산 함수들
    calculateCouponDiscount,
    calculateFinalAmount,
  };
};
