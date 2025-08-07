import type { Notification } from '../../../shared/types';

/**
 * 토스트 알림을 위한 헬퍼 함수들
 */
export const ToastHelpers = {
  /**
   * 토스트 알림이 표시되어야 하는지 확인
   * @param notifications - 알림 목록
   * @returns 표시 여부
   */
  shouldShowToasts: (notifications: Notification[]): boolean => notifications.length > 0,

  /**
   * 특정 타입의 알림 개수 반환
   * @param notifications - 알림 목록
   * @param type - 알림 타입
   * @returns 해당 타입의 알림 개수
   */
  getNotificationCountByType: (notifications: Notification[], type: Notification['type']): number =>
    notifications.filter((n) => n.type === type).length,

  /**
   * 가장 최근 알림 반환
   * @param notifications - 알림 목록
   * @returns 가장 최근 알림 또는 null
   */
  getLatestNotification: (notifications: Notification[]): Notification | null =>
    notifications.length > 0 ? notifications[notifications.length - 1] : null,
};
