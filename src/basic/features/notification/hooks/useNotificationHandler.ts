import { useCallback } from "react";

import {
  extractNotificationData,
  isNotificationError,
} from "@/basic/features/notification/models/notification.model";
import { NotificationType } from "@/types";

interface UseNotificationHandlerProps {
  addNotification: (
    message: string,
    type: NotificationType,
    duration?: number
  ) => void;
}

export const useNotificationHandler = ({
  addNotification,
}: UseNotificationHandlerProps) => {
  // 에러를 처리하고 알림을 추가하는 함수
  const handleError = useCallback(
    (error: unknown) => {
      if (isNotificationError(error)) {
        const { message, type, duration } = extractNotificationData(error);
        addNotification(message, type, duration);
        return true; // 처리됨
      }
      return false; // 처리되지 않음
    },
    [addNotification]
  );

  // 함수를 래핑하여 에러를 자동으로 처리하는 함수
  const wrapWithErrorHandler = useCallback(
    <T extends (...args: any[]) => any>(fn: T): T => {
      return ((...args: Parameters<T>) => {
        try {
          return fn(...args);
        } catch (error) {
          if (handleError(error)) {
            // NotificationError는 이미 처리되었으므로 다시 throw하지 않음
            return;
          }
          // 다른 에러는 다시 throw
          throw error;
        }
      }) as T;
    },
    [handleError]
  );

  // 비동기 함수를 래핑하여 에러를 자동으로 처리하는 함수
  const wrapAsyncWithErrorHandler = useCallback(
    <T extends (...args: any[]) => Promise<any>>(fn: T): T => {
      return ((...args: Parameters<T>) => {
        return fn(...args).catch((error: unknown) => {
          if (handleError(error)) {
            // NotificationError는 이미 처리되었으므로 Promise.resolve() 반환
            return Promise.resolve();
          }
          // 다른 에러는 다시 throw
          return Promise.reject(error);
        });
      }) as T;
    },
    [handleError]
  );

  return {
    handleError,
    wrapWithErrorHandler,
    wrapAsyncWithErrorHandler,
  };
};
