import { useCallback, useState } from 'react';

import { useCouponStore } from './useCouponStore';
import type { CartItem, Coupon, NotificationVariant } from '../../types';
import { calculateCartTotal } from '../models/cart';

interface UseCouponServiceProps {
  onAddNotification: (message: string, type: NotificationVariant) => void;
}

export function useCouponService({ onAddNotification }: UseCouponServiceProps) {
  const { coupons, addCoupon, deleteCoupon } = useCouponStore();
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const onResetSelectedCoupon = useCallback(() => {
    setSelectedCoupon(null);
  }, []);

  const onAddCoupon = useCallback(
    (newCoupon: Coupon) => {
      const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
      if (existingCoupon) {
        onAddNotification('이미 존재하는 쿠폰 코드입니다.', 'error');
        return;
      }
      addCoupon(newCoupon);
      onAddNotification('쿠폰이 추가되었습니다.', 'success');
    },
    [coupons, onAddNotification, addCoupon]
  );

  const onDeleteCoupon = useCallback(
    (couponCode: string) => {
      deleteCoupon(couponCode);
      if (selectedCoupon?.code === couponCode) {
        onResetSelectedCoupon();
      }
      onAddNotification('쿠폰이 삭제되었습니다.', 'success');
    },
    [selectedCoupon, onAddNotification, deleteCoupon, onResetSelectedCoupon]
  );

  const onApplyCoupon = useCallback(
    (cart: CartItem[], coupon: Coupon) => {
      const currentTotal = calculateCartTotal(cart, selectedCoupon).totalAfterDiscount;

      if (currentTotal < 10000 && coupon.discountType === 'percentage') {
        onAddNotification('percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.', 'error');
        return;
      }

      setSelectedCoupon(coupon);
      onAddNotification('쿠폰이 적용되었습니다.', 'success');
    },
    [selectedCoupon, onAddNotification]
  );

  return {
    coupons,
    selectedCoupon,
    onAddCoupon,
    onDeleteCoupon,
    onApplyCoupon,
    onResetSelectedCoupon,
  };
}
