import { useAtomValue, useSetAtom } from 'jotai';
import {
  notificationAtom,
  addNotificationAtom,
} from '../atoms/notificationAtoms';

export const useNotifications = () => {
  const notification = useAtomValue(notificationAtom);
  const addNotification = useSetAtom(addNotificationAtom);

  return {
    notification,
    addNotification,
  };
};
