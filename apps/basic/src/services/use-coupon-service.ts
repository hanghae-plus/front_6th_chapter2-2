import { calculateItemDiscounts, calculateSubtotal } from '@/models/cart';
import {
  calculateCouponDiscount,
  Coupon,
  isValidPercentageCoupon,
} from '@/models/coupon';
import { notificationTypeSchema } from '@/models/notification';
import { useCartStore } from '@/store';
import { useCallback, useState } from 'react';
import { useNotificationService } from './use-notification-service';

export const useCouponService = () => {
  const [selectedCoupon, setSelectedCoupon] = useState<Nullable<Coupon>>(null);
  const { addNotification } = useNotificationService();
  const cartStore = useCartStore();

  const calculateTotalWithCouponDiscount = useCallback(() => {
    const subtotal = calculateSubtotal(cartStore.cart);
    const itemDiscounts = calculateItemDiscounts(cartStore.cart);
    const totalAfterItemDiscounts = subtotal - itemDiscounts;
    const couponDiscount = calculateCouponDiscount(
      totalAfterItemDiscounts,
      selectedCoupon
    );
    return Math.max(0, totalAfterItemDiscounts - couponDiscount);
  }, [cartStore.cart, selectedCoupon]);

  const validateCouponEligibility = useCallback(
    (coupon: Coupon) => {
      const totalAfterDiscount = calculateTotalWithCouponDiscount();
      if (totalAfterDiscount < 10000 && isValidPercentageCoupon(coupon)) {
        throw new Error(
          'percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.'
        );
      }
    },
    [calculateTotalWithCouponDiscount]
  );

  const applyCouponToCart = useCallback(
    (coupon: Coupon) => {
      try {
        validateCouponEligibility(coupon);
        setSelectedCoupon(coupon);
        addNotification('쿠폰이 적용되었습니다.');
      } catch (error) {
        if (error instanceof Error) {
          addNotification(error.message, notificationTypeSchema.enum.error);
        }
        return;
      }
    },
    [validateCouponEligibility, addNotification]
  );

  const clearSelectedCoupon = useCallback(() => {
    setSelectedCoupon(null);
  }, []);

  return {
    selectedCoupon,
    applyCoupon: applyCouponToCart,
    resetSelectedCoupon: clearSelectedCoupon,
    calculateTotalWithCouponDiscount,
  };
};
