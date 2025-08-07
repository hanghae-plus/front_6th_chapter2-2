import React from 'react';
import { useAtom } from 'jotai';
import type { ToastItemProps, ToastContainerProps } from './type';
import { getToastBackgroundClass, getToastPositionClass } from './model';
import { notificationsAtom, removeNotificationAtom } from '../../../atoms/notificationAtoms';
import { CloseIcon } from '../../icons';

/**
 * 개별 토스트 알림 아이템 컴포넌트
 */
export function ToastItem({ notification, onRemove }: ToastItemProps) {
  const backgroundClass = getToastBackgroundClass(notification.type);

  return React.createElement(
    'div',
    {
      key: notification.id,
      className: `p-4 rounded-md shadow-md text-white flex justify-between items-center ${backgroundClass}`,
    },
    [
      React.createElement('span', { key: 'message', className: 'mr-2' }, notification.message),
      React.createElement(
        'button',
        {
          key: 'close',
          onClick: () => onRemove(notification.id),
          className: 'text-white hover:text-gray-200',
        },
        React.createElement(CloseIcon),
      ),
    ],
  );
}

/**
 * 토스트 알림 컨테이너 컴포넌트
 */
export function ToastContainer({ position = 'top-right', className = '' }: ToastContainerProps) {
  const [notifications] = useAtom(notificationsAtom);
  const [, removeNotification] = useAtom(removeNotificationAtom);

  if (notifications.length === 0) {
    return null;
  }

  const positionClass = getToastPositionClass(position);
  const containerClass = `${positionClass} space-y-2 max-w-sm ${className}`.trim();

  return React.createElement(
    'div',
    { className: containerClass },
    notifications.map((notification) =>
      React.createElement(ToastItem, {
        key: notification.id,
        notification,
        onRemove: removeNotification,
      }),
    ),
  );
}
