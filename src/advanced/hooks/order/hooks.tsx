import { useCallback } from 'react';
import { useClearCart } from '../cart/hooks';
import { useClearSelectedCoupon } from '../coupon/hooks';
import { useNotify } from '../notification/hooks';

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
