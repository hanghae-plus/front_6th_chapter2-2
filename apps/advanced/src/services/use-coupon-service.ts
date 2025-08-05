import { Coupon, isValidPercentageCoupon } from '@/models/coupon';
import {
  NotificationType,
  notificationTypeSchema
} from '@/models/notification';
import { calculateTotalWithCouponDiscount } from '@/models/order';
import { useCartStore, useCouponStore } from '@/store';
import { useCallback, useState } from 'react';

type Props = {
  addNotification: (message: string, type?: NotificationType) => void;
};

export const useCouponService = ({ addNotification }: Props) => {
  const [selectedCoupon, setSelectedCoupon] = useState<Nullable<Coupon>>(null);
  const couponStore = useCouponStore();
  const cartStore = useCartStore();

  const getTotalWithCouponDiscount = useCallback(() => {
    if (!selectedCoupon) return 0;

    return calculateTotalWithCouponDiscount(cartStore.cart, selectedCoupon);
  }, [cartStore.cart, selectedCoupon]);

  const validateCouponEligibility = useCallback(
    (coupon: Coupon) => {
      if (!selectedCoupon) return;
      const totalAfterDiscount = calculateTotalWithCouponDiscount(
        cartStore.cart,
        selectedCoupon
      );
      if (totalAfterDiscount < 10000 && isValidPercentageCoupon(coupon)) {
        throw new Error(
          'percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.'
        );
      }
    },
    [cartStore.cart, selectedCoupon]
  );

  const addCoupon = useCallback(
    (coupon: Coupon) => {
      couponStore.addCoupon(coupon);
    },
    [couponStore]
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

  const getCoupons = useCallback(() => {
    return couponStore.coupons;
  }, [couponStore.coupons]);

  return {
    // state
    getCoupons: getCoupons,

    // actions
    addCoupon,
    selectedCoupon,
    applyCoupon: applyCouponToCart,
    resetSelectedCoupon: clearSelectedCoupon,
    calculateTotalWithCouponDiscount: getTotalWithCouponDiscount,

    removeCouponByCode: couponStore.removeCouponByCode
  };
};
