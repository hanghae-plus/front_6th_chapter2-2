import { atom } from 'jotai';

export const debouncedSearchAtom = atom('');

export const setDebouncedSearchAtom = atom(null, (get, set, search: string) => {
  set(debouncedSearchAtom, search);
});
