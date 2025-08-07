import { useAtom, atom } from "jotai";
import { useEffect, useMemo } from "react";

/**
 * @param value - 디바운스할 값
 * @param delay - 지연 시간 (milliseconds)
 * @returns 디바운스된 값
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const debouncedAtom = useMemo(() => atom<T>(value), []);
  const [debouncedValue, setDebouncedValue] = useAtom(debouncedAtom);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay, setDebouncedValue]);

  return debouncedValue;
};
