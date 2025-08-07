import { useEffect, useState } from 'react';

/**
 * 값이 변경된 후 지정한 delay 동안 값이 변경되지 않으면 최종 값을 반환하는 디바운스 훅
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

