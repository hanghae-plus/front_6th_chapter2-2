import { useCallback } from "react";

interface UseOrderHandlersProps {
  // 알림 처리
  addNotification: (
    message: string,
    type: "success" | "error" | "warning"
  ) => void;

  // Cart와 Coupon 액션들 (네임스페이스 구조 활용)
  cartActions: {
    clear: () => void;
  };
  couponActions: {
    clearSelected: () => void;
  };
}

/**
 * 주문 관련 핸들러들을 제공하는 훅 (네임스페이스 구조)
 */
export const useOrderHandlers = ({
  addNotification,
  cartActions,
  couponActions,
}: UseOrderHandlersProps) => {
  const complete = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      "success"
    );
    cartActions.clear();
    couponActions.clearSelected();
  }, [addNotification, cartActions, couponActions]);

  return {
    // 네임스페이스 구조
    actions: {
      complete,
    },

    // 하위 호환성을 위해 기존 방식도 유지
    completeOrder: complete,
  };
};
