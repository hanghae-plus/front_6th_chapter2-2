import { useCallback } from 'react';

export default function useCheckout(
  clearCart: () => void,
  clearSelectedCoupon: () => void,
  onSuccess: (message: string) => void,
) {
  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    onSuccess?.(`주문이 완료되었습니다. 주문번호: ${orderNumber}`);
    clearCart();
    clearSelectedCoupon();
  }, [onSuccess]);

  return {
    completeOrder,
  };
}
