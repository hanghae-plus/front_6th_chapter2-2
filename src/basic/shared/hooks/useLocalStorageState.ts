import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

type UseLocalStorageStateProps<S> = {
  key: string;
  initialState: S;
};

export function useLocalStorageState<S>({
  key,
  initialState
}: UseLocalStorageStateProps<S>): [S, Dispatch<SetStateAction<S>>] {
  const readLocalStorage = () => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as S) : initialState;
    } catch {
      return initialState;
    }
  };

  const [state, setState] = useState<S>(readLocalStorage);

  useEffect(() => {
    const isEmpty = state === undefined || state === null;
    const isEmptyObject = typeof state === "object" && Object.keys(state || {}).length === 0;
    const isEmptyArray = Array.isArray(state) && state.length === 0;

    if (isEmpty || isEmptyObject || isEmptyArray) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(state));
    }
  }, [state, key]);

  return [state, setState];
}
