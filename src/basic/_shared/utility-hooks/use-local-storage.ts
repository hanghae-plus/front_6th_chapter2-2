import { useCallback, useEffect, useState } from "react";

const serialize = (value: unknown) => {
  return JSON.stringify(value);
};

const deserialize = <T>(
  value: string | null | undefined
): T | undefined | null => {
  try {
    if (value == undefined) {
      return value;
    }

    const parsed = JSON.parse(value) as T;

    return parsed;
  } catch {
    console.error(`Failed to deserialize value: ${value}`);
    return undefined;
  }
};

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [data, setData] = useState<T>(
    () => deserialize<T>(localStorage.getItem(key)) ?? initialValue
  );

  const removeData = useCallback(() => {
    localStorage.removeItem(key);
  }, [key]);

  useEffect(() => {
    localStorage.setItem(key, serialize(data));
  }, [data]);

  return [data, setData, removeData] as const;
};
