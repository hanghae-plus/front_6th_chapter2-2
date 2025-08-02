import { calculateItemDiscounts, calculateSubtotal } from '@/models/cart';
import { calculateCouponDiscount, Coupon } from '@/models/coupon';
import { useCartStore } from '@/store';
import { useCallback } from 'react';
import { useNotificationService } from './use-notification-service';

export const useOrderService = () => {
  const { addNotification } = useNotificationService();
  const cartStore = useCartStore();

  const generateOrderNumber = useCallback(() => `ORD-${Date.now()}`, []);

  const calculateCartTotal = useCallback(
    (
      selectedCoupon: Nullable<Coupon>
    ): {
      totalBeforeDiscount: number;
      totalAfterDiscount: number;
    } => {
      // 1단계: 기본 금액 계산
      const subtotal = calculateSubtotal(cartStore.cart);

      // 2단계: 아이템 할인 계산
      const itemDiscounts = calculateItemDiscounts(cartStore.cart);
      const totalAfterItemDiscounts = subtotal - itemDiscounts;

      // 3단계: 쿠폰 할인 계산
      const couponDiscount = calculateCouponDiscount(
        totalAfterItemDiscounts,
        selectedCoupon
      );

      // 4단계: 최종 금액 계산
      const finalTotal = Math.max(0, totalAfterItemDiscounts - couponDiscount);

      return {
        totalBeforeDiscount: Math.round(subtotal),
        totalAfterDiscount: Math.round(finalTotal),
      };
    },
    [cartStore.cart]
  );

  const completeOrder = useCallback(
    (selectedCoupon: Nullable<Coupon>, resetCart: () => void) => {
      addNotification(
        `주문이 완료되었습니다. 주문번호: ${generateOrderNumber()}`
      );
      resetCart();
      return selectedCoupon ? { resetCoupon: true } : {};
    },
    [addNotification, generateOrderNumber]
  );

  return {
    calculateCartTotal,
    completeOrder,
  };
};
