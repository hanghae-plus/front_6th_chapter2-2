import type { NotificationFunction } from "../../../shared";

export const couponNotificationService = {
  showAddSuccess: (addNotification: NotificationFunction) => {
    addNotification("쿠폰이 추가되었습니다.", "success");
  },

  showDeleteSuccess: (addNotification: NotificationFunction) => {
    addNotification("쿠폰이 삭제되었습니다.", "success");
  },

  showApplySuccess: (addNotification: NotificationFunction) => {
    addNotification("쿠폰이 적용되었습니다.", "success");
  },

  showValidationError: (message: string, addNotification: NotificationFunction) => {
    addNotification(message, "error");
  }
};
