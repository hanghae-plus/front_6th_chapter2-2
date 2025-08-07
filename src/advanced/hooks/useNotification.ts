import { useAtom, useSetAtom } from 'jotai';
import { useCallback } from 'react';

import {
  notificationsAtom,
  addNotificationAtom,
  removeNotificationAtom,
} from '../atoms/notificationAtoms';

const useNotification = () => {
  const [notifications] = useAtom(notificationsAtom);
  const addNotificationAction = useSetAtom(addNotificationAtom);
  const removeNotificationAction = useSetAtom(removeNotificationAtom);

  const addNotification = useCallback(
    (message: string, type: 'error' | 'success' | 'warning' = 'success') => {
      const id = Date.now().toString();
      addNotificationAction({ id, message, type });
    },
    [addNotificationAction],
  );

  const removeNotification = useCallback(
    (id: string) => {
      removeNotificationAction(id);
    },
    [removeNotificationAction],
  );

  return {
    notifications,
    addNotification,
    removeNotification,
  };
};

export { useNotification };
