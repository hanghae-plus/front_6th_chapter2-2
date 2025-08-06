import { useCallback } from "react";
import { Coupon } from "../../types";

interface UseOrderHandlersProps {
  addNotification: (
    message: string,
    type: "success" | "error" | "warning"
  ) => void;
  setCart: (cart: any[]) => void;
  setSelectedCoupon: (coupon: Coupon | null) => void;
}

export const useOrderHandlers = ({
  addNotification,
  setCart,
  setSelectedCoupon,
}: UseOrderHandlersProps) => {
  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      "success"
    );
    setCart([]);
    setSelectedCoupon(null);
  }, [addNotification, setCart, setSelectedCoupon]);

  return {
    completeOrder,
  };
};
