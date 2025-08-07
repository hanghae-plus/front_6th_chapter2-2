// LocalStorage Hook
// 원본 App.tsx의 localStorage 패턴을 참고하여 구현
// 1. localStorage와 React state 동기화
// 2. 초기값 로드 시 에러 처리
// 3. 저장 시 JSON 직렬화/역직렬화
// 4. 빈 배열이나 undefined는 삭제

import { useState, useEffect } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // 초기값 로드 (원본 App.tsx 패턴과 동일)
  const [storedValue, setStoredValue] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialValue;
      }
    }
    return initialValue;
  });

  // 값 설정 함수 (원본 App.tsx 패턴과 동일)
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // 함수형 업데이트 지원
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // localStorage 동기화 (원본 App.tsx 패턴과 동일)
  useEffect(() => {
    if (storedValue === undefined || storedValue === null) {
      localStorage.removeItem(key);
    } else if (Array.isArray(storedValue)) {
      // 배열인 경우 원본 App.tsx 패턴과 동일하게 처리
      if (storedValue.length > 0) {
        localStorage.setItem(key, JSON.stringify(storedValue));
      } else {
        localStorage.removeItem(key);
      }
    } else {
      localStorage.setItem(key, JSON.stringify(storedValue));
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}
