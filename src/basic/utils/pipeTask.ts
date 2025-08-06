type Task<T> = () => Promise<T> | T;

/** this가 본인의 Context 참조되도록 해야 하므로 화살표함수가 아닌 함수 표현형으로 정의*/
export function pipeTask<T>(run: Task<T>) {
  let successHandler: ((result: T) => void) | undefined;
  let errorHandler: ((error: unknown) => void) | undefined;
  let finallyHandler: (() => void) | undefined;

  const obj = {
    onSuccess(cb: (result: T) => void) {
      successHandler = cb;
      return obj;
    },
    onError(cb: (err: unknown) => void) {
      errorHandler = cb;
      return obj;
    },
    finally(cb: () => void) {
      finallyHandler = cb;
      return obj;
    },
    run() {
      try {
        const result = run();
        if (result instanceof Promise) {
          result
            .then((res) => successHandler?.(res))
            .catch((err) => errorHandler?.(err))
            .finally(() => finallyHandler?.());
        } else {
          successHandler?.(result);
          finallyHandler?.();
        }
      } catch (err) {
        errorHandler?.(err);
        finallyHandler?.();
      }
    },
  };

  return obj;
}
