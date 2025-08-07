import { Dispatch, SetStateAction, useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [storageValue, setStorageValue] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialValue;
      }
    }
    return initialValue;
  });

  const setValue: Dispatch<SetStateAction<T>> = (value) => {
    try {
      const newValue =
        typeof value === 'function' ? (value as (prevState: T) => T)(storageValue) : value;
      setStorageValue(newValue);
      if (value === null || value === undefined || (Array.isArray(value) && value.length === 0)) {
        return localStorage.removeItem(key);
      }

      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving value to localStorage key ${key}: ${error}`);
    }
  };

  return [storageValue, setValue];
}
