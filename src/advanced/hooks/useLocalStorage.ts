import { useState } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // 초기값을 가져오는 함수
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // localStorage에 값을 저장하는 함수
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // 함수인 경우 이전 값을 받아서 새로운 값을 계산
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      // localStorage에 저장
      if (valueToStore !== null && valueToStore !== undefined) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } else {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
