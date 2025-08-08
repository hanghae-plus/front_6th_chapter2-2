import { useState, useEffect } from "react";

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  // 초기값을 로컬스토리지에서 가져오거나 기본값 사용asdf
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // 값이 변경될 때마다 로컬스토리지에 저장
  useEffect(() => {
    try {
      if (
        storedValue === null ||
        (Array.isArray(storedValue) && storedValue.length === 0)
      ) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.error(`Error saving to localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
};
