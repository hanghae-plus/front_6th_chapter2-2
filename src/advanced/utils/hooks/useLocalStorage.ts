import { useState, useEffect } from "react";

const resolveValue = <T>(
  value: T | ((currentValue: T) => T),
  currentValue: T
): T => (value instanceof Function ? value(currentValue) : value);

const loadFromStorage = <T>(key: string, initialValue: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initialValue;
  } catch {
    return initialValue;
  }
};

const saveToStorage = <T>(key: string, value: T): void => {
  try {
    if (
      value === undefined ||
      value === null ||
      (Array.isArray(value) && value.length === 0)
    ) {
      localStorage.removeItem(key);
      return;
    }
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.warn("저장 실패");
  }
};

export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T | ((value: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() =>
    loadFromStorage(key, initialValue)
  );

  const setValue = (value: T | ((val: T) => T)): void => {
    try {
      const valueToStore = resolveValue(value, storedValue);
      setStoredValue(valueToStore);
      saveToStorage(key, valueToStore);
    } catch {
      console.warn("setValue 실패");
    }
  };

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== null) {
        try {
          setStoredValue(JSON.parse(event.newValue));
        } catch {
          setStoredValue(initialValue);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, initialValue]);

  return [storedValue, setValue];
};
