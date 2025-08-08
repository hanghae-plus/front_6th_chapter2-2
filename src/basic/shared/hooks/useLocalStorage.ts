import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useSyncExternalStore,
} from "react";

const getLocalStorageItem = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const setLocalStorageItem = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {}
};

const listeners = new Set<() => void>();

const notify = () => {
  listeners.forEach((listener) => listener());
};

const localStorageSubscriber = (listener: () => void) => {
  window.addEventListener("storage", listener);
  listeners.add(listener);

  return () => {
    window.removeEventListener("storage", listener);
    listeners.delete(listener);
  };
};

export function useLocalStorage(
  key: string
): readonly [string | null, (value: string) => void];
export function useLocalStorage(
  key: string,
  initialValue?: string
): readonly [string, (value: string) => void];
export function useLocalStorage(key: string, initialValue?: string) {
  const value = useSyncExternalStore(
    localStorageSubscriber,
    () => getLocalStorageItem(key) ?? initialValue ?? null
  );

  const setValue = useCallback(
    (setStateAction: SetStateAction<string>) => {
      const currentValue = getLocalStorageItem(key) ?? initialValue ?? "";
      const newValue =
        typeof setStateAction === "function"
          ? setStateAction(currentValue)
          : setStateAction;

      setLocalStorageItem(key, newValue);
      notify();
    },
    [key, initialValue]
  );

  return [
    value as typeof initialValue extends undefined ? string | null : string,
    setValue,
  ] as const;
}

export function useLocalStorageObject<ObjectType extends object>(
  key: string
): readonly [
  ObjectType,
  ObjectType | ((value: ObjectType | null) => ObjectType)
];
export function useLocalStorageObject<ObjectType extends object>(
  key: string,
  initialValue: ObjectType
): readonly [ObjectType, Dispatch<SetStateAction<ObjectType>>];
export function useLocalStorageObject<ObjectType extends object>(
  key: string,
  initialValue?: ObjectType
) {
  const [jsonString, setJsonString] = useLocalStorage(
    key,
    initialValue ? JSON.stringify(initialValue) : undefined
  );

  const value = useMemo(() => {
    try {
      const parsed = JSON.parse(jsonString ?? "null") as ObjectType | null;
      return parsed ?? initialValue ?? null;
    } catch {
      return initialValue ?? null;
    }
  }, [jsonString, initialValue]);

  const setValue = useCallback(
    (
      setStateAction: ObjectType | ((value: ObjectType | null) => ObjectType)
    ) => {
      try {
        const currentValue =
          JSON.parse(getLocalStorageItem(key) ?? "null") ?? initialValue;
        const newValue =
          typeof setStateAction === "function"
            ? setStateAction(currentValue)
            : setStateAction;

        setJsonString(JSON.stringify(newValue));
      } catch {}
    },
    [key, initialValue, setJsonString]
  );

  return [value, setValue] as const;
}
