import { useState, useEffect } from 'react';

type SetValue<T> = T | ((val: T) => T);

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: { removeWhenEmpty?: boolean }
): [T, (value: SetValue<T>) => void] {
  // localStorage에서 초기값 가져오기
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // localStorage에 값 저장하는 함수
  const setValue = (value: SetValue<T>) => {
    try {
      // useState의 함수형 업데이트와 같은 패턴 지원
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      // localStorage에 저장
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // storedValue가 변경될 때마다 localStorage 동기화
  useEffect(() => {
    try {
      // removeWhenEmpty 옵션이 true이고 배열이 비어있으면 제거
      if (options?.removeWhenEmpty && Array.isArray(storedValue) && storedValue.length === 0) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.error(`Error syncing localStorage key "${key}":`, error);
    }
  }, [key, storedValue, options]);

  return [storedValue, setValue];
}