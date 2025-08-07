import { useAtomValue, useSetAtom } from 'jotai';
import type { Notification, Notify } from '../../types';
import {
  addNotificationAtom,
  notificationsAtom,
  removeNotificationAtom,
} from '../atoms/notification';

export function useNotifications(): Notification[] {
  return useAtomValue(notificationsAtom);
}

export function useNotify() {
  const notify = useSetAtom(addNotificationAtom);
  const removeNotification = useSetAtom(removeNotificationAtom);

  const notifyAndRemove: Notify = ({ message, type = 'success' }) => {
    const TOAST_DURATION = 3_000;
    const id = Date.now().toString();
    notify({ message, type, id });

    setTimeout(() => {
      removeNotification({ id });
    }, TOAST_DURATION);
  };

  return notifyAndRemove;
}

export function useRemoveNotification() {
  return useSetAtom(removeNotificationAtom);
}
