import { atom } from 'jotai';

export const isAdminAtom = atom(false);
export const searchTermAtom = atom('');
export const debouncedSearchTermAtom = atom('');
