import { useCallback } from 'react';
import { useNotify } from './useNotification';

interface UseOrderParams {
  clearCart: () => void;
  clearSelectedCoupon: () => void;
}

export function useOrder({ clearCart, clearSelectedCoupon }: UseOrderParams) {
  const notify = useNotify();

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
