import { useCallback } from 'react';
import { useSetAtom } from 'jotai';
import { useNotification } from '../../../shared/utils';
import { cartAtom, selectedCouponAtom } from '../../../shared/store';

export function useOrder() {
  const { addNotification } = useNotification();
  const setCart = useSetAtom(cartAtom);
  const setSelectedCoupon = useSetAtom(selectedCouponAtom);

  // 주문 완료 처리
  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      'success'
    );
    setCart([]);
    setSelectedCoupon(null);
  }, [addNotification, setCart, setSelectedCoupon]);

  return {
    completeOrder,
  };
}
