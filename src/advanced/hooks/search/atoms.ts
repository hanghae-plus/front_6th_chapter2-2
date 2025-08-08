import { atom } from 'jotai';

export const debouncedSearchAtom = atom('');

export const setDebouncedSearchAtom = atom(null, (_, set, search: string) => {
  set(debouncedSearchAtom, search);
});
