import { useCallback } from 'react';

interface UseOrderProps {
  addNotification: (message: string, type?: 'error' | 'success' | 'warning') => void;
  clearCart: () => void;
  applyCoupon: (coupon: null) => void;
}

const useOrder = ({ addNotification, clearCart, applyCoupon }: UseOrderProps) => {
  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, 'success');
    clearCart();
    applyCoupon(null);
  }, [addNotification, clearCart, applyCoupon]);

  return {
    completeOrder,
  };
};

export { useOrder };
