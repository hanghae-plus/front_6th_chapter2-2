// TODO: LocalStorage Hook
// 힌트:
// 1. localStorage와 React state 동기화
// 2. 초기값 로드 시 에러 처리
// 3. 저장 시 JSON 직렬화/역직렬화
// 4. 빈 배열이나 undefined는 삭제
// LocalStorage Hook
// localStorage와 React state를 동기화하는 훅
// 초기값 로드 시 에러 처리, JSON 직렬화/역직렬화 지원
// 빈 배열이나 undefined는 localStorage에서 삭제
//
// 반환값: [저장된 값, 값 설정 함수]

import { useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // localStorage에서 초기값 로드
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return initialValue;
      }
      return JSON.parse(item);
    } catch (error) {
      console.warn(`Error loading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 값을 설정하는 함수
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // 함수형 업데이트 지원
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);

      // localStorage에 저장
      if (valueToStore === undefined) {
        // undefined는 localStorage에서 제거
        localStorage.removeItem(key);
      } else if (Array.isArray(valueToStore) && valueToStore.length === 0) {
        // 빈 배열은 localStorage에서 제거 (하지만 상태는 유지)
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
