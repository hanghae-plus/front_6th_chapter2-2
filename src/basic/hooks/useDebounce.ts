import { useState, useEffect } from 'react';

/**
 * 입력값을 지연시켜 빈번한 업데이트를 방지하는 Hook
 * @param value - 지연시킬 값
 * @param delay - 지연 시간 (밀리초)
 * @returns 지연된 값
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};
