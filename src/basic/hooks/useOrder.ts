import { useCallback } from "react";
import { useAutoCallback } from "../utils/hooks/useAutoCallbak";
import { withTryNotifySuccess } from "../utils/withNotify";

interface UseOrderProps {
  clearCart: () => void;
  addNotification?: (message: string, type?: "error" | "success" | "warning") => void;
}

export const useOrder = ({ clearCart, addNotification }: UseOrderProps) => {
  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    clearCart();
    return orderNumber;
  }, [clearCart]);

  const handleCompleteOrder = useAutoCallback(
    withTryNotifySuccess(completeOrder, "주문이 완료되었습니다.", addNotification ?? (() => {}))
  );

  return {
    completeOrder: handleCompleteOrder,
  };
};
