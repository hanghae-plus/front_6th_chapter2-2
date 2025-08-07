import { useState, useCallback } from "react";

// localStorage와 React state를 동기화하는 커스텀 훅
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // 지연 초기화로 localStorage에서 값 읽기
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        return JSON.parse(item);
      }
      return initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 값 설정 함수 (함수형 업데이트 지원)
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // React useState와 동일한 패턴으로 함수형 업데이트 처리
        setStoredValue((prevValue) => {
          const valueToStore = value instanceof Function ? value(prevValue) : value;
          
          // localStorage에 저장
          localStorage.setItem(key, JSON.stringify(valueToStore));
          
          return valueToStore;
        });
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key]
  );

  return [storedValue, setValue];
}