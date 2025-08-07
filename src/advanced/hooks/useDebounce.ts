import { useState, useEffect } from "react";

const DEFAULT_DELAY_MS = 500;

export const useDebounce = (value: string, delay: number = DEFAULT_DELAY_MS) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};
