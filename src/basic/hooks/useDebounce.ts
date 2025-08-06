import { useState, useEffect } from "react";

/**
 * 입력 값(value)의 변경이 일정 시간(delay) 동안 일어나지 않을 때만 해당 값을 반환하는 디바운스(debounce) 훅입니다.
 * 주로 검색어 입력 등 빠르게 변하는 값을 일정 시간 이후에 처리할 때 사용합니다.
 *
 * @template T - 디바운스할 값의 타입
 * @param value - 디바운스를 적용할 값
 * @param delay - 디바운스 대기 시간(ms)
 * @returns 디바운스 처리된 값
 *
 * @example
 * const debouncedSearch = useDebounce(searchKeyword, 300);
 * useEffect(() => {
 *   fetchData(debouncedSearch);
 * }, [debouncedSearch]);
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
