import { useState, useCallback } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // 초기값 설정 (로컬스토리지에서 불러오기)
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 값 설정 함수
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        setStoredValue((prevValue) => {
          const valueToStore =
            value instanceof Function ? value(prevValue) : value;

          if (typeof window !== "undefined" && window.localStorage) {
            try {
              window.localStorage.setItem(key, JSON.stringify(valueToStore));
            } catch (storageError) {
              console.warn(
                `Error setting localStorage key "${key}":`,
                storageError
              );
            }
          }

          return valueToStore;
        });
      } catch (error) {
        console.warn(`Error in setValue for key "${key}":`, error);
      }
    },
    [key]
  );

  // 값 제거 함수
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      window.localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
