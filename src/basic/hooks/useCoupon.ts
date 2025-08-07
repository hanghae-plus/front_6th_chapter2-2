import { useState, useCallback } from 'react';
import { CartItem, Coupon } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { couponService } from '../services/couponService';

/**
 * 초기 쿠폰 목록
 */
const initialCoupons: Coupon[] = [
  {
    name: '5000원 할인',
    code: 'AMOUNT5000',
    discountType: 'amount',
    discountValue: 5000,
  },
  {
    name: '10% 할인',
    code: 'PERCENT10',
    discountType: 'percentage',
    discountValue: 10,
  },
];

/**
 * 쿠폰 관리 Hook의 Props 인터페이스
 */
interface UseCouponsProps {
  cart: CartItem[];
  calculateCartTotal: (
    cart: CartItem[],
    coupon: Coupon | null
  ) => {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
  addNotification: (message: string, type: 'success' | 'error') => void;
}

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
export const useCoupon = ({
  cart,
  calculateCartTotal,
  addNotification,
}: UseCouponsProps) => {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>(
    'coupons',
    initialCoupons
  );
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

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
    [cart, calculateCartTotal]
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
