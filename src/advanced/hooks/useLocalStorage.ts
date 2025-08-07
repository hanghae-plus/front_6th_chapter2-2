import { useState, useCallback, useEffect } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        return JSON.parse(item);
      }
    } catch {
      // ignore
    }
    return initialValue;
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      setStoredValue((prev) => {
        const val = value instanceof Function ? value(prev) : value;
        if (val === undefined || (Array.isArray(val) && val.length === 0)) {
          window.localStorage.removeItem(key);
        } else {
          window.localStorage.setItem(key, JSON.stringify(val));
        }
        return val;
      });
    },
    [key]
  );

  useEffect(() => {
    if (
      storedValue === undefined ||
      (Array.isArray(storedValue) && storedValue.length === 0)
    ) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}
