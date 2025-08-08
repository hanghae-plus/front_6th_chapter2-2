// 시도해서 성공하면 알림을 보냄. 실패하면 에러 알림
export const withTryNotifySuccess = <T extends readonly unknown[], R>(
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
      const errorMessage = error instanceof Error ? error.message : "오류가 발생했습니다";
      addNotification(errorMessage, "error");
      return undefined;
    }
  };
};

// 비동기 함수용: 시도해서 성공하면 알림
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
      const errorMessage = error instanceof Error ? error.message : "오류가 발생했습니다";
      addNotification(errorMessage, "error");
      return undefined;
    }
  };
};

// 시도해서 에러만 알림 (성공 알림 없음)
export const withTryNotifyError = <T extends readonly unknown[], R>(
  action: (...args: T) => R,
  addNotification: (message: string, type: "success" | "error") => void
) => {
  return (...args: T): R | undefined => {
    try {
      return action(...args);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "오류가 발생했습니다";
      addNotification(errorMessage, "error");
      return undefined;
    }
  };
};
