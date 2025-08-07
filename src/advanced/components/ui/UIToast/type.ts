import type { Notification } from '../../../shared/types';

/**
 * 토스트 알림 컨테이너의 props 타입
 * @interface ToastContainerProps
 * @property {Notification[]} notifications - 알림 목록
 * @property {(id: string) => void} onRemove - 알림 제거 함수
 * @property {'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'} position - 알림 위치
 * @property {string} className - 추가 클래스명
 */
export interface ToastContainerProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  className?: string;
}

/**
 * 개별 토스트 알림의 props 타입
 * @interface ToastItemProps
 * @property {Notification} notification - 알림 데이터
 * @property {(id: string) => void} onRemove - 알림 제거 함수
 */
export interface ToastItemProps {
  notification: Notification;
  onRemove: (id: string) => void;
}
