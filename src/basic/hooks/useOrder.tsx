import { useCallback } from 'react';
import type { Notify } from '../../types';

interface UseOrderParams {
  notify: Notify;
  clearCart: () => void;
  clearSelectedCoupon: () => void;
}

export function useOrder({
  notify,
  clearCart,
  clearSelectedCoupon,
}: UseOrderParams) {
  return {
    completeOrder: useCallback(() => {
      const orderNumber = `ORD-${Date.now()}`;
      notify({
        message: `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
        type: 'success',
      });
      clearCart();
      clearSelectedCoupon();
    }, [notify, clearCart, clearSelectedCoupon]),
  };
}
