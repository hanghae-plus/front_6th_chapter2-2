import { useEffect, useState } from "react";

interface UseDebounceValueProps<T> {
  value: T;
  delay: number;
}

export const useDebounceValue = <T>({
  value,
  delay,
}: UseDebounceValueProps<T>) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
