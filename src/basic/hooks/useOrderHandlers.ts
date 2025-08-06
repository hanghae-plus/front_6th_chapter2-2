import { useCallback } from "react";

interface UseOrderHandlersProps {
  addNotification: (
    message: string,
    type: "success" | "error" | "warning"
  ) => void;
  onClearCart: () => void;
  onClearCoupon: () => void;
}

export const useOrderHandlers = ({
  addNotification,
  onClearCart,
  onClearCoupon,
}: UseOrderHandlersProps) => {
  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      "success"
    );
    onClearCart();
    onClearCoupon();
  }, [addNotification, onClearCart, onClearCoupon]);

  return {
    completeOrder,
  };
};
