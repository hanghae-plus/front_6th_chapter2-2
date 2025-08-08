import { useCallback, useRef } from "react";

type AnyFunction = (...args: any[]) => any;

export const useAutoCallback = <T extends AnyFunction>(fn: T) => {
  const callbackRef = useRef(fn);
  callbackRef.current = fn;
  return useCallback((...args: Parameters<T>) => {
    return callbackRef.current?.(...args);
  }, []) as T;
};
