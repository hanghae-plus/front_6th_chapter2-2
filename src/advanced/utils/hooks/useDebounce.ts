import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number = 500): T {
  let state = value;
  const [debouncedState, setDebouncedState] = useState(state);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedState(state);
    }, delay);
    return () => clearTimeout(timer);
  }, [state]);

  return debouncedState;
}
