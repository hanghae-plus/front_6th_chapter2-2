import { useCallback } from 'react';
import type { AddNotificationParams } from './useNotification';

interface UseOrderParams {
  addNotification: (params: AddNotificationParams) => void;
  clearCart: () => void;
  clearSelectedCoupon: () => void;
}

export function useOrder({
  addNotification,
  clearCart,
  clearSelectedCoupon,
}: UseOrderParams) {
  return {
    completeOrder: useCallback(() => {
      const orderNumber = `ORD-${Date.now()}`;
      addNotification({
        message: `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
        type: 'success',
      });
      clearCart();
      clearSelectedCoupon();
    }, [addNotification, clearCart, clearSelectedCoupon]),
  };
}
