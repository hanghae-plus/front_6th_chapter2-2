// 알림 관련 상수

// 알림 타입
export const NOTIFICATION_TYPE_ERROR = "error";
export const NOTIFICATION_TYPE_SUCCESS = "success";
export const NOTIFICATION_TYPE_WARNING = "warning";

// 알림 타입 배열 (타입 체크용)
export const NOTIFICATION_TYPES = [
  NOTIFICATION_TYPE_ERROR,
  NOTIFICATION_TYPE_SUCCESS,
  NOTIFICATION_TYPE_WARNING,
] as const;
