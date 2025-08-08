import { useAtom, useSetAtom } from "jotai";
import {
  notificationsAtom,
  addSuccessNotificationAtom,
  addErrorNotificationAtom,
  addWarningNotificationAtom,
  removeNotificationAtom,
} from "../model/atoms";

export function useNotificationStore() {
  const notifications = useAtom(notificationsAtom)[0];
  const removeNotification = useSetAtom(removeNotificationAtom);
  const addSuccessNotification = useSetAtom(addSuccessNotificationAtom);
  const addErrorNotification = useSetAtom(addErrorNotificationAtom);
  const addWarningNotification = useSetAtom(addWarningNotificationAtom);

  return {
    notifications,
    removeNotification,
    addSuccessNotification,
    addErrorNotification,
    addWarningNotification,
  };
}
