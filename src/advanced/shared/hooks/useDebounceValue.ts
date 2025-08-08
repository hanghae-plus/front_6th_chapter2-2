import { useEffect, useState } from "react";

type UseDebounceValueProps<T> = {
  delay: number;
  value: T;
};

export function useDebounceValue<T>({ delay, value }: UseDebounceValueProps<T>) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const debouncedTimeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(debouncedTimeout);
  }, [value, delay]);

  return debouncedValue;
}
