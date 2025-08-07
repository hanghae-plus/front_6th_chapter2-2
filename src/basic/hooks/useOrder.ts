import { useCallback } from "react";
import { useAutoCallback } from "../utils/hooks/useAutoCallbak";
import { Coupon } from "../../types";

interface UseOrderProps {
  clearCart: () => void;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  addNotification?: (message: string, type?: "error" | "success" | "warning") => void;
}

export const useOrder = ({ clearCart, setSelectedCoupon, addNotification }: UseOrderProps) => {
  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    clearCart();
    setSelectedCoupon(null);
    return orderNumber;
  }, [clearCart, setSelectedCoupon]);

  const handleCompleteOrder = useAutoCallback(() => {
    try {
      const orderNumber = completeOrder();
      addNotification?.(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, "success");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "주문 완료 중 오류가 발생했습니다";
      addNotification?.(errorMessage, "error");
    }
  });

  return {
    completeOrder: handleCompleteOrder,
  };
};
