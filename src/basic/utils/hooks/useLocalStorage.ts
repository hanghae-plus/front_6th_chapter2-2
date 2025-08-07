import { useEffect, useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const item = getLocalStorage(key);

    return item !== null ? item : initialValue;
  });

  useEffect(() => {
    setLocalStorage(key, value);
  }, [value]);

  return [value, setValue] as const;
}

function getLocalStorage(key: string) {
  try {
    const item = localStorage.getItem(key);

    if (item) {
      return JSON.parse(item);
    }

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function setLocalStorage<T>(key: string, value: T) {
  try {
    const shouldRemove = value === undefined || (Array.isArray(value) && value.length === 0);

    if (shouldRemove) {
      localStorage.removeItem(key);
      return;
    }

    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(error);
    return;
  }
}
