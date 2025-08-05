import { useCallback, useEffect, useState } from 'react';
import { CartItem, Coupon } from '../../../types';
import { initialCoupons } from '../../data/mockCoupons';
import { calculateCartTotal } from '../../utils/calculations/cartCalculations';

export const useCoupons = (
  onSuccess?: (message: string) => void,
  onError?: (message: string) => void,
) => {
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('coupons');
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

  // 쿠폰 사용하기
  const applyCoupon = useCallback(
    (coupon: Coupon, cart: CartItem[]) => {
      const currentTotal = calculateCartTotal(cart, selectedCoupon).totalAfterDiscount;

      if (currentTotal < 10000 && coupon.discountType === 'percentage') {
        // addNotification('percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.', 'error');
        onError?.('percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.');
        return;
      }

      setSelectedCoupon(coupon);
      // addNotification('쿠폰이 적용되었습니다.', 'success');
      onSuccess?.('쿠폰이 적용되었습니다.');
    },
    [onSuccess, onError],
  );

  // 쿠폰 변화 감지하여 로컬 스토리지 업데이트
  useEffect(() => {
    localStorage.setItem('coupons', JSON.stringify(coupons));
  }, [coupons]);

  return {
    coupons,
    setCoupons,
    selectedCoupon,
    setSelectedCoupon,
    applyCoupon,
  };
};
