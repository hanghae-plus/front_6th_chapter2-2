import { useCallback } from "react";
import { addGlobalNotification } from "../../../shared/libs/notificationStore";

// 전역에서 notification을 추가만 할 수 있는 훅
export function useGlobalNotification() {
  const addNotification = useCallback(addGlobalNotification, []);

  return {
    addNotification,
  };
}
