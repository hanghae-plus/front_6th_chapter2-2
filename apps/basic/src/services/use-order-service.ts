import { Coupon } from '@/models/coupon';
import { NotificationType } from '@/models/notification';
import { calculateCartTotal, generateOrderNumber } from '@/models/order';
import { useCartStore } from '@/store';
import { useCallback } from 'react';

type Props = {
  addNotification: (message: string, type?: NotificationType) => void;
};

export const useOrderService = ({ addNotification }: Props) => {
  const cartStore = useCartStore();

  const getCartTotal = useCallback(
    (selectedCoupon: Nullable<Coupon>) => {
      return calculateCartTotal(cartStore.cart, selectedCoupon);
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
    calculateCartTotal: getCartTotal,
    completeOrder
  };
};
