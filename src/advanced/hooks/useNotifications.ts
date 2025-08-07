import { useAtom, useSetAtom } from 'jotai';
import { ToastType } from '../../types.ts';
import {
  notificationsAtom,
  addNotificationAtom,
  hideNotificationAtom,
  showNotifyFromResultAtom,
} from '../atoms';

export function useNotifications() {
  const [notifications] = useAtom(notificationsAtom);
  const addNotification = useSetAtom(addNotificationAtom);
  const hideNotification = useSetAtom(hideNotificationAtom);
  const showNotifyFromResult = useSetAtom(showNotifyFromResultAtom);

  return {
    notifications,
    addNotification: (message: string, type: ToastType = 'success') =>
      addNotification({ message, type }),
    showNotifyFromResult,
    hideNotification,
  };
}
