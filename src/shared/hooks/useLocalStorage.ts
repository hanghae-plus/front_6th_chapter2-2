import { useState } from 'react';

const getLocalStorage = <T>(key: string, initialValue: T): T => {
  const saved = localStorage.getItem(key);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return initialValue;
    }
  }
  return initialValue;
};

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    return getLocalStorage(key, initialValue);
  });

  const setLocalStorage = (newValue: T | ((prev: T) => T)) => {
    const valueToStore =
      typeof newValue === 'function' ? (newValue as (prev: T) => T)(value) : newValue;
    localStorage.setItem(key, JSON.stringify(valueToStore));
    setValue(valueToStore);
  };

  return [value, setLocalStorage];
}
