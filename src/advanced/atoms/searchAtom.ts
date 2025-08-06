import { atom } from 'jotai';

export const searchQueryAtom = atom<string>('');

export const debouncedSearchQueryAtom = atom<string>('');

export const updateDebouncedSearchAtom = atom(null, (_, set, query: string) => {
  set(searchQueryAtom, query);

  setTimeout(() => {
    set(debouncedSearchQueryAtom, query);
  }, 500);
});
