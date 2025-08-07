import { atom } from 'jotai';

// 검색어
export const searchTermAtom = atom<string>('');

// 디바운스된 검색어
export const debouncedSearchTermAtom = atom<string>('');
