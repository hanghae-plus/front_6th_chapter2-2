import type { ToastContainerProps } from './type';
import type { Notification } from '../../../shared/types';

/**
 * 토스트 알림의 배경색을 결정하는 순수함수
 * @param type - 알림 타입
 * @returns CSS 클래스명
 */
export const getToastBackgroundClass = (type: Notification['type']): string => {
  switch (type) {
    case 'error':
      return 'bg-red-600';
    case 'warning':
      return 'bg-yellow-600';
    case 'success':
    default:
      return 'bg-green-600';
  }
};

/**
 * 토스트 컨테이너의 위치 클래스를 반환하는 순수함수
 * @param position - 토스트 위치
 * @returns CSS 위치 클래스명
 */
export const getToastPositionClass = (position: ToastContainerProps['position'] = 'top-right'): string => {
  switch (position) {
    case 'top-left':
      return 'fixed top-20 left-4 z-50';
    case 'bottom-right':
      return 'fixed bottom-4 right-4 z-50';
    case 'bottom-left':
      return 'fixed bottom-4 left-4 z-50';
    case 'top-right':
    default:
      return 'fixed top-20 right-4 z-50';
  }
};
