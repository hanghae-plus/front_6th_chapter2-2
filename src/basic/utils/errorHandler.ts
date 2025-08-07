/**
 * 시도해서 성공하면 알림을 보내는 Higher Order Function
 */
export const withTryNotifySuccess = <T extends unknown[], R>(
  action: (...args: T) => R,
  successMessage: string,
  addNotification: (message: string, type: "success" | "error") => void
) => {
  return (...args: T): R | undefined => {
    try {
      const result = action(...args);
      addNotification(successMessage, "success");
      return result;
    } catch (error) {
      addNotification(error instanceof Error ? error.message : "오류가 발생했습니다", "error");
      return undefined;
    }
  };
};

/**
 * 비동기 함수용: 시도해서 성공하면 알림
 */
export const withAsyncTryNotifySuccess = <T extends unknown[], R>(
  action: (...args: T) => Promise<R>,
  successMessage: string,
  addNotification: (message: string, type: "success" | "error") => void
) => {
  return async (...args: T): Promise<R | undefined> => {
    try {
      const result = await action(...args);
      addNotification(successMessage, "success");
      return result;
    } catch (error) {
      addNotification(error instanceof Error ? error.message : "오류가 발생했습니다", "error");
      return undefined;
    }
  };
};

/**
 * 시도해서 에러만 알림 (성공 알림 없음)
 */
export const withTryNotifyError = <T extends unknown[], R>(
  action: (...args: T) => R,
  addNotification: (message: string, type: "success" | "error") => void
) => {
  return (...args: T): R | undefined => {
    try {
      return action(...args);
    } catch (error) {
      addNotification(error instanceof Error ? error.message : "오류가 발생했습니다", "error");
      return undefined;
    }
  };
};

// 하위 호환성을 위한 alias (기존 코드에서 사용 중)
export const withErrorHandling = withTryNotifySuccess;
export const withAsyncErrorHandling = withAsyncTryNotifySuccess;
export const withErrorOnly = withTryNotifyError;
