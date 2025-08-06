import { useCallback } from 'react';
import { useSetAtom } from 'jotai';
import { cartAtom } from '../../atoms/cartAtoms';
import { selectedCouponAtom } from '../../atoms/couponsAtom';
import { addNotificationAtom } from '../../atoms/notificationsAtoms';

export default function useCheckout() {
  const setCart = useSetAtom(cartAtom);
  const setSelectedCoupon = useSetAtom(selectedCouponAtom);
  const addNotification = useSetAtom(addNotificationAtom);

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;

    // 성공 알림
    addNotification({
      message: `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      type: 'success',
    });

    // 장바구니 비우기
    setCart([]);

    // 선택된 쿠폰 초기화
    setSelectedCoupon(null);
  }, [setCart, setSelectedCoupon, addNotification]);

  return {
    completeOrder,
  };
}
