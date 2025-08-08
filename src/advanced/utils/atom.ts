import { atom } from 'jotai';

export const atomWithLocalStorage = <T>(key: string, initialValue: T) => {
  const getInitialValue = () => {
    const item = localStorage.getItem(key);
    if (item !== null) {
      try {
        return JSON.parse(item);
      } catch {
        return initialValue;
      }
    }
    return initialValue;
  };

  const initialValueFromStorage = getInitialValue();

  const baseAtom = atom<T>(initialValueFromStorage);

  const derivedAtom = atom(
    (get) => get(baseAtom),
    (_, set, update: T) => {
      set(baseAtom, update);
      localStorage.setItem(key, JSON.stringify(update));
    },
  );

  return derivedAtom;
};
