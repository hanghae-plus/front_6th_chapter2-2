import { useState, useEffect } from "react";

/**
 * 값의 변경을 지연시키는 debounce 훅
 * @param value - debounce를 적용할 값
 * @param delay - 지연 시간 (밀리초)
 * @returns debounced된 값
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
