import { useState } from 'react';

/**
 * localStorage와 연동되는 상태 관리 Hook
 * @param key - localStorage key
 * @param initialValue - 기본값
 * @returns [상태값, 상태변경함수]
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] => {
  // localStorage에서 초기값 가져오기
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        // 빈 배열이나 잘못된 데이터인 경우 초기값 사용
        if (Array.isArray(parsed) && parsed.length === 0) {
          return initialValue;
        }
        return parsed;
      }
    } catch (error) {
      console.warn(`localStorage getItem 실패 (key: ${key}):`, error);
    }
    return initialValue;
  });

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      // 함수형 업데이트 사용 (이전 값을 전달)
      setStoredValue(prevValue => {
        const valueToStore =
          value instanceof Function ? value(prevValue) : value;

        // localStorage 저장
        if (
          key === 'cart' &&
          Array.isArray(valueToStore) &&
          valueToStore.length === 0
        ) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, JSON.stringify(valueToStore));
        }

        return valueToStore;
      });
    } catch (error) {
      console.warn(`localStorage setItem 실패 (key: ${key}):`, error);
    }
  };

  return [storedValue, setValue];
};
