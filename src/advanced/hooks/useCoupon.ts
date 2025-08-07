import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { Coupon } from '../types';
import { cartAtom } from '../atoms/cartAtoms';
import { couponsAtom, selectedCouponAtom } from '../atoms/couponAtoms';
import { couponService } from '../services/couponService';
import { calculateCartTotal } from '../utils/calculators';
import { useNotifications } from './useNotifications';

/**
 * 쿠폰 상태를 관리하는 커스텀 Hook
 *
 * 기능:
 * - 쿠폰 목록 관리
 * - 선택된 쿠폰 관리
 * - 쿠폰 적용 및 추가
 * - 쿠폰 삭제 및 선택 해제
 *
 * @param cart - 장바구니 상품 목록
 * @param calculateCartTotal - 장바구니 총 금액 계산 함수
 * @param addNotification - 알림 추가 함수
 * @returns 쿠폰 관련 상태와 함수들
 */
export const useCoupon = () => {
  const [cart] = useAtom(cartAtom);
  const [coupons, setCoupons] = useAtom(couponsAtom);
  const [selectedCoupon, setSelectedCoupon] = useAtom(selectedCouponAtom);
  const { addNotification } = useNotifications();

  const onApplyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = calculateCartTotal(cart, null).totalBeforeDiscount;
      const validationResult = couponService.validateCouponApplication(
        coupon,
        currentTotal
      );

      if (!validationResult.isValid) {
        addNotification(validationResult.message, 'error');
        return;
      }

      setSelectedCoupon(coupon);
    },
    [cart, calculateCartTotal, addNotification]
  );

  const onAddCoupon = useCallback(
    (newCoupon: Coupon) => {
      // 중복 쿠폰 코드 검증
      const validationResult = couponService.checkDuplicateCoupon(
        newCoupon,
        coupons
      );

      if (!validationResult.isValid) {
        addNotification(validationResult.message, 'error');
        return;
      }

      // 쿠폰 추가
      setCoupons(prev => [...prev, newCoupon]);
      addNotification(validationResult.message, 'success');
    },
    [coupons, addNotification]
  );

  const onRemoveCoupon = useCallback(
    (couponCode: string) => {
      setCoupons(prev => prev.filter(c => c.code !== couponCode));

      if (couponService.shouldClearSelectedCoupon(couponCode, selectedCoupon)) {
        setSelectedCoupon(null);
      }

      addNotification('쿠폰이 삭제되었습니다.', 'success');
    },
    [selectedCoupon, addNotification]
  );

  const onClearSelectedCoupon = useCallback(() => {
    setSelectedCoupon(null);
  }, []);

  return {
    coupons,
    selectedCoupon,
    onApplyCoupon,
    onAddCoupon,
    onRemoveCoupon,
    onClearSelectedCoupon,
  };
};
