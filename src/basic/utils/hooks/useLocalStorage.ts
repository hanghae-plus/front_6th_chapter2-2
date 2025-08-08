import { useState, useEffect } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // localStorage에서 값 가져오기
  const readValue = () => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`useLocalStorage: Error reading key "${key}"`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // 저장 함수 (setState처럼 사용 가능)
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // 빈 배열 또는 undefined면 localStorage에서 제거
      if (
        valueToStore === undefined ||
        (Array.isArray(valueToStore) && valueToStore.length === 0)
      ) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(valueToStore));
      }

      setStoredValue(valueToStore);
    } catch (error) {
      console.warn(`useLocalStorage: Error setting key "${key}"`, error);
    }
  };

  // key가 바뀌면 localStorage 값 새로 읽기
  useEffect(() => {
    setStoredValue(readValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [storedValue, setValue];
}
