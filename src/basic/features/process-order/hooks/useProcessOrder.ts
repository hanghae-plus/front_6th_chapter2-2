import { useCallback } from "react";
import {
  useGlobalNotification,
  NotificationVariant,
} from "@entities/notification";

interface UseProcessOrderOptions {
  onClearCart: () => void;
  onClearCoupon: () => void;
}

export function useProcessOrder({
  onClearCart,
  onClearCoupon,
}: UseProcessOrderOptions) {
  const { addNotification } = useGlobalNotification();

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;

    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      NotificationVariant.SUCCESS
    );

    onClearCart();
    onClearCoupon();
  }, [addNotification, onClearCart, onClearCoupon]);

  return {
    completeOrder,
  };
}
