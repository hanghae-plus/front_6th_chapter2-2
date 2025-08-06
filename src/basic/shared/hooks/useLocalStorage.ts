import { useCallback, useEffect, useState } from "react";

const getLocalStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);

    if (item === null) {
      return defaultValue;
    }

    return JSON.parse(item);
  } catch (error) {
    console.error(`로컬스토리지에서 읽기 실패 (키: ${key}):`, error);

    return defaultValue;
  }
};

const setLocalStorageItem = <T>(key: string, value: T): boolean => {
  try {
    const serializedValue = JSON.stringify(value);

    localStorage.setItem(key, serializedValue);

    return true;
  } catch (error) {
    console.error(`로컬스토리지에 저장 실패 (키: ${key}):`, error);

    return false;
  }
};

export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() =>
    getLocalStorageItem(key, defaultValue)
  );

  useEffect(() => {
    setLocalStorageItem(key, storedValue);
  }, [key, storedValue]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue);
          setStoredValue(newValue);
        } catch (error) {
          console.error(`로컬스토리지 파싱 실패 (키: ${key}):`, error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue((prev) => {
      const valueToStore =
        typeof value === "function" ? (value as (prev: T) => T)(prev) : value;
      return valueToStore;
    });
  }, []);

  return [storedValue, setValue];
}
