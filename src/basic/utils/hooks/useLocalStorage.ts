import { useState } from "react";

type UseLocalStorageProps<T> = {
  key: string;
  initialValue?: T;
};

export const useLocalStorage = <T>({
  key,
  initialValue,
}: UseLocalStorageProps<T>): [T, (value: T | ((prev: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((prev: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);

    if (value === undefined || (Array.isArray(value) && !value.length)) {
      localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    }
  };

  return [storedValue, setValue];
};
