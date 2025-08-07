import { useState, useEffect, useCallback } from 'react';

/**
 * LocalStorage 훅 구현
 * @param key - localStorage에 저장할 키
 * @param initialValue - 초기값
 * @returns [저장된 값, 값 설정 함수]
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`localStorage에서 ${key}를 읽는 중 오류 발생:`, error);
      return initialValue;
    }
  });

  /**
   * 빈 배열이나 undefined인지 확인
   * @param value - 저장할 값
   * @returns 빈 배열이나 undefined인지 여부
   */
  const isEmpty = (value: T): boolean => {
    if (value === null || value === undefined) return true;
    if (Array.isArray(value) && value.length === 0) return true;
    return false;
  };

  /**
   * localStorage에 값 저장
   * @param value - 저장할 값
   */
  const persistToStorage = useCallback(
    (value: T): void => {
      try {
        if (isEmpty(value)) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, JSON.stringify(value));
        }
      } catch (error) {
        console.warn(`localStorage에 ${key}를 저장하는 중 오류 발생:`, error);
      }
    },
    [key],
  );

  /**
   * 상태 업데이트 함수 - 함수형 업데이트 지원
   * @param value - 저장할 값
   */
  const setValue = useCallback((value: T | ((val: T) => T)): void => {
    setStoredValue((prevValue) => {
      // 함수형 업데이트인 경우 현재 값을 인자로 전달
      const newValue = typeof value === 'function' ? (value as (val: T) => T)(prevValue) : value;

      // localStorage에 저장 (side effect를 명시적으로 분리)
      setStoredValue(newValue);

      return newValue;
    });
  }, []);

  // localStorage와 React state 동기화
  useEffect(() => {
    persistToStorage(storedValue);
  }, [storedValue, persistToStorage]);

  return [storedValue, setValue];
}
