import type { NotificationFunction } from "../../../shared";

export const cartNotificationService = {
  showAddToCartSuccess: (addNotification: NotificationFunction) => {
    addNotification("장바구니에 담았습니다", "success");
  },

  showValidationError: (message: string, addNotification: NotificationFunction) => {
    addNotification(message, "error");
  },

  showOrderSuccess: (orderNumber: string, addNotification: NotificationFunction) => {
    addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, "success");
  }
};
