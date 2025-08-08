import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // delay 동안 대기 후 debouncedValue 업데이트
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // value가 바뀌면 이전 타이머 제거 (reset 효과)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
