import { useEffect, useState } from "react";

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

const storageEventListeners = new Map<string, Set<(value: any) => void>>();

const subscribeToStorageChange = (
  key: string,
  callback: (value: any) => void
) => {
  if (!storageEventListeners.has(key)) {
    storageEventListeners.set(key, new Set());
  }
  storageEventListeners.get(key)!.add(callback);

  return () => {
    const listeners = storageEventListeners.get(key);

    if (listeners) {
      listeners.delete(callback);

      if (listeners.size === 0) {
        storageEventListeners.delete(key);
      }
    }
  };
};

const notifyStorageChange = (key: string, value: any) => {
  const listeners = storageEventListeners.get(key);

  if (listeners) {
    listeners.forEach((callback) => callback(value));
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
    const unsubscribe = subscribeToStorageChange(key, (newValue) => {
      setStoredValue(newValue);
    });

    return unsubscribe;
  }, [key]);

  useEffect(() => {
    setLocalStorageItem(key, storedValue);
  }, [key, storedValue]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue);

          notifyStorageChange(key, newValue);
        } catch (error) {
          console.error(`로컬스토리지 파싱 실패 (키: ${key}):`, error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  const setValue = (value: T | ((prev: T) => T)) => {
    setStoredValue((prev) => {
      const valueToStore =
        typeof value === "function" ? (value as (prev: T) => T)(prev) : value;

      setLocalStorageItem(key, valueToStore);
      notifyStorageChange(key, valueToStore);

      return valueToStore;
    });
  };

  return [storedValue, setValue];
}
