import { useCallback } from "react";

type Task<T, Args extends any[] = any[]> = (...args: Args) => Promise<T> | T;

interface UseTaskOptions<T> {
  onSuccess?: (result: T) => void;
  onError?: (error: unknown) => void;
  deps?: any[];
}

export function useTask<T, Args extends any[] = any[]>(
  taskFn: Task<T, Args>,
  options: UseTaskOptions<T> = {}
) {
  const { onSuccess, onError, deps = [] } = options;

  const run = useCallback(
    async (...args: Args): Promise<T | undefined> => {
      try {
        const result = await taskFn(...args);
        onSuccess?.(result);
        return result;
      } catch (error) {
        onError?.(error);
      }
    },
    [taskFn, onSuccess, onError, ...deps]
  );

  return run;
}
