import { useSetAtom } from 'jotai';
import { useCallback } from 'react';

import { clearCartAtom, applyCouponAtom } from '../atoms/cartAtoms';
import { addNotificationAtom } from '../atoms/notificationAtoms';

const useOrder = () => {
  // atoms 사용
  const addNotificationAction = useSetAtom(addNotificationAtom);
  const clearCartAction = useSetAtom(clearCartAtom);
  const applyCouponAction = useSetAtom(applyCouponAtom);

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    const id = Date.now().toString();
    addNotificationAction({
      id,
      message: `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      type: 'success',
    });
    clearCartAction();
    applyCouponAction(null);
  }, [addNotificationAction, clearCartAction, applyCouponAction]);

  return {
    completeOrder,
  };
};

export { useOrder };
