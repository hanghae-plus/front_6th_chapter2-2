// TODO: LocalStorage Hook
// 힌트:
// 1. localStorage와 React state 동기화
// 2. 초기값 로드 시 에러 처리
// 3. 저장 시 JSON 직렬화/역직렬화
// 4. 빈 배열이나 undefined는 삭제
//
// 반환값: [저장된 값, 값 설정 함수]

import { useState } from "react";

export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] => {
  // 초기값 설정
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return initialValue;

      return JSON.parse(saved) as T;
    } catch {
      return initialValue;
    }
  });

  // 값 설정 함수
  const setValue = (value: T | ((val: T) => T)) => {
    setStoredValue((prev) => {
      // value는 T 타입이거나, (prev: T) => T 형태
      // 함수면 이전 상태 prev를 넣어 새 상태를 계산
      const newValue =
        typeof value === "function" ? (value as (val: T) => T)(prev) : value;

      if (
        // 빈 배열이나 undefined면 localStorage에서 제거
        newValue === undefined ||
        (Array.isArray(newValue) && newValue.length === 0)
      ) {
        localStorage.removeItem(key);
      } else {
        // 그 외엔 JSON으로 직렬화해서 localStorage에 저장
        localStorage.setItem(key, JSON.stringify(newValue));
      }

      return newValue;
    });
  };

  return [storedValue, setValue];
};
