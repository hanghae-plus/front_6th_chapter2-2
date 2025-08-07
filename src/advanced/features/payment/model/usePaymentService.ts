import { useSetAtom } from 'jotai';
import { useCallback } from 'react';

import { Coupon } from '../../../../types';
import { addNotificationAtom } from '../../../entities/notification';

export function usePaymentService() {
  const addNotification = useSetAtom(addNotificationAtom);

  const completeOrder = useCallback(
    (selectedCoupon: Coupon | null) => {
      const orderNumber = `ORD-${Date.now()}`;

      if (selectedCoupon) {
        addNotification('쿠폰이 적용되었습니다.', 'success');
      }

      addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, 'success');
    },
    [addNotification]
  );

  return { completeOrder };
}
