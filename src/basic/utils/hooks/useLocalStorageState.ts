import { useEffect, useState, useCallback } from "react";

/**
 * React 상태와 localStorage를 일치시키는 훅 (1번 방식)
 *
 * @param key localStorage key
 * @param initialValue 초기값
 * @returns [state, setState] 형태의 상태 훅
 */
export function useLocalStorageState<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initialValue;
    } catch (err) {
      console.warn(`useLocalStorageState: parse error on key "${key}"`, err);
      return initialValue;
    }
  });

  // 상태가 바뀔 때 localStorage에 저장
  useEffect(() => {
    try {
      if (
        state === undefined ||
        state === null ||
        (Array.isArray(state) && state.length === 0)
      ) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(state));
      }
    } catch (err) {
      console.error(`useLocalStorageState: set error on key "${key}"`, err);
    }
  }, [key, state]);

  // setter를 한 번 감싸서 setState와 동일하게 동작 (함수형 업데이트 지원)
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setState(value);
  }, []);

  return [state, setValue];
}
