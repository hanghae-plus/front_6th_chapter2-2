import { useCallback } from 'react';
import { CartItemType, CouponType } from '@/types';

interface UsePaymentPropsType {
  addNotification: (message: string, type: 'success' | 'error') => void;
  setCart: (cart: CartItemType[]) => void;
  setSelectedCoupon: (coupon: CouponType | null) => void;
}

export const usePayment = ({
  addNotification,
  setCart,
  setSelectedCoupon,
}: UsePaymentPropsType) => {
  // 주문 완료 처리
  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, 'success');
    setCart([]);
    setSelectedCoupon(null);
  }, [addNotification]);

  return { completeOrder };
};
