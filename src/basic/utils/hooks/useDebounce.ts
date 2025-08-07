import { useState, useEffect } from "react";

/**
 * @param value - 디바운스할 값
 * @param delay - 지연 시간 (milliseconds)
 * @returns 디바운스된 값
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};
