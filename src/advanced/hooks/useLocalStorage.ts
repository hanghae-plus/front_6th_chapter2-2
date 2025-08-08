import { useState, useEffect, useCallback } from "react";
import { createStore } from "../utils/createStore";

export const useLocalStorage = <T>(key: string, initialValue: T | (() => T)) => {
  const store = createStore(key, window.localStorage);

  const [value, setValue] = useState<T>(() => {
    const stored = store.get();
    // stored가 null이거나 빈 배열이면 초기값 사용
    if (stored !== null && (Array.isArray(stored) ? stored.length > 0 : true)) {
      return stored;
    }
    // initialValue가 함수인지 확인하고 실행
    return typeof initialValue === "function" ? (initialValue as () => T)() : initialValue;
  });

  // localStorage에 저장
  useEffect(() => {
    store.set(value);
  }, [value, store]);

  const setStoredValue = useCallback((newValue: T | ((val: T) => T)) => {
    setValue(newValue);
  }, []);

  const removeValue = useCallback(() => {
    store.remove();
    setValue(typeof initialValue === "function" ? (initialValue as () => T)() : initialValue);
  }, [store, initialValue]);

  return [value, setStoredValue, removeValue] as const;
};
