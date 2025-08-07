import { useState, useCallback } from "react";

/**
 * 로컬스토리지 커스텀 훅
 * @param {string} key localStorage 키
 * @param {T} initialValue 초기값 (직접 전달하거나 함수로 전달)
 * @returns [value, setValue]
 */
function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  const getStoredValue = useCallback(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        return JSON.parse(item) as T;
      }
      return typeof initialValue === "function"
        ? (initialValue as () => T)()
        : initialValue;
    } catch (e) {
      return typeof initialValue === "function"
        ? (initialValue as () => T)()
        : initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState<T>(getStoredValue);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (e) {
          throw "localStorage 저장 실패";
        }
        return valueToStore;
      });
    },
    [key]
  );

  return [storedValue, setValue] as const;
}

export default useLocalStorage;
