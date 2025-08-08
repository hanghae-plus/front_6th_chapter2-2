import { useCallback } from "react";
import { useGlobalNotification } from "@entities/notification";

interface UseProcessOrderOptions {
  onClearCart: () => void;
  onClearCoupon: () => void;
}

export function useProcessOrder({
  onClearCart,
  onClearCoupon,
}: UseProcessOrderOptions) {
  const { showSuccessNotification } = useGlobalNotification();

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;

    showSuccessNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`);

    onClearCart();
    onClearCoupon();
  }, [showSuccessNotification, onClearCart, onClearCoupon]);

  return {
    completeOrder,
  };
}
