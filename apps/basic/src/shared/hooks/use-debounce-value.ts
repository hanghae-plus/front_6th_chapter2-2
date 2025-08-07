import { useEffect, useState } from 'react';

export const useDebounceValue = <T>(initialValue: T, delay: number = 500) => {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return {
    value,
    setValue,
    debouncedValue
  };
};
