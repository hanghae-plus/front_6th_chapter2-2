import { useSetAtom } from "jotai";
import {
  addSuccessNotificationAtom,
  addErrorNotificationAtom,
  addWarningNotificationAtom,
} from "../model/atoms";

export function useGlobalNotification() {
  const showSuccessNotification = useSetAtom(addSuccessNotificationAtom);
  const showErrorNotification = useSetAtom(addErrorNotificationAtom);
  const showWarningNotification = useSetAtom(addWarningNotificationAtom);

  return {
    showSuccessNotification,
    showErrorNotification,
    showWarningNotification,
  };
}
