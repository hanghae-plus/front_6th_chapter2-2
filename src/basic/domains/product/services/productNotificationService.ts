import type { NotificationFunction } from "../../../shared";

export const productNotificationService = {
  showAddSuccess: (addNotification: NotificationFunction) => {
    addNotification("상품이 추가되었습니다.", "success");
  },

  showUpdateSuccess: (addNotification: NotificationFunction) => {
    addNotification("상품이 수정되었습니다.", "success");
  },

  showDeleteSuccess: (addNotification: NotificationFunction) => {
    addNotification("상품이 삭제되었습니다.", "success");
  }
};
