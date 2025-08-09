export interface Notification {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}

/**
 * 새로운 알림을 생성하는 함수
 */
export const createNotification = (
  message: string,
  type: "error" | "success" | "warning" = "success"
): Notification => {
  return {
    id: Date.now().toString(),
    message,
    type,
  };
};

/**
 * 알림 목록에 새 알림을 추가하는 함수
 */
export const addNotification = (
  notifications: Notification[],
  notification: Notification
): Notification[] => {
  return [...notifications, notification];
};

/**
 * 특정 ID의 알림을 제거하는 함수
 */
export const removeNotification = (
  notifications: Notification[],
  notificationId: string
): Notification[] => {
  return notifications.filter((n) => n.id !== notificationId);
};

/**
 * 알림 타입에 따른 CSS 클래스를 반환하는 함수
 */
export const getNotificationClassName = (
  type: Notification["type"]
): string => {
  switch (type) {
    case "error":
      return "bg-red-600";
    case "warning":
      return "bg-yellow-600";
    case "success":
    default:
      return "bg-green-600";
  }
};
