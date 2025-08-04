// TODO: LocalStorage Hook
// 힌트:
// 1. localStorage와 React state 동기화
// 2. 초기값 로드 시 에러 처리
// 3. 저장 시 JSON 직렬화/역직렬화
// 4. 빈 배열이나 undefined는 삭제
//
// 반환값: [저장된 값, 값 설정 함수]

import { useState, useCallback, useEffect } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        return JSON.parse(item);
      }
    } catch {
      // ignore
    }
    return initialValue;
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      setStoredValue((prev) => {
        const val = value instanceof Function ? value(prev) : value;
        if (val === undefined || (Array.isArray(val) && val.length === 0)) {
          window.localStorage.removeItem(key);
        } else {
          window.localStorage.setItem(key, JSON.stringify(val));
        }
        return val;
      });
    },
    [key]
  );

  useEffect(() => {
    if (
      storedValue === undefined ||
      (Array.isArray(storedValue) && storedValue.length === 0)
    ) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}
