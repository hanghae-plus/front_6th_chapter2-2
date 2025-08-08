import { useState, useEffect } from 'react';

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
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

  useEffect(() => {
    if (storedValue !== undefined) {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } else {
      localStorage.removeItem(key);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
};
