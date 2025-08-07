import { useAtom } from 'jotai';
import { addNotificationAtom, removeNotificationAtom } from '../atoms/notificationAtoms';

/**
 * 알림 액션을 위한 hook
 */
export function useNotificationActions() {
  const [, addNotification] = useAtom(addNotificationAtom);
  const [, removeNotification] = useAtom(removeNotificationAtom);

  return {
    addNotification,
    removeNotification,
  };
}
