import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  // 최종적으로 안정된 값을 저장할 상태
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // delay 후 value를 debouncedValue로 업데이트
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // value가 바뀌면 타이머 취소 후 새로 시작
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
