import { useCallback } from 'react';
import { useClearCart } from './useCart';
import { useClearSelectedCoupon } from './useCoupons';
import { useNotify } from './useNotification';

export function useCompleteOrder() {
  const notify = useNotify();
  const clearCart = useClearCart();
  const clearSelectedCoupon = useClearSelectedCoupon();

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
