import { useCallback } from 'react';
import { useClearCart } from './useCart';
import { useNotify } from './useNotification';

interface UseOrderParams {
  clearSelectedCoupon: () => void;
}

export function useOrder({ clearSelectedCoupon }: UseOrderParams) {
  const notify = useNotify();
  const clearCart = useClearCart();

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
