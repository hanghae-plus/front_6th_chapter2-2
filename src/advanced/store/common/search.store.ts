import { atom } from 'jotai';

// 🎯 기본 검색어 atom
export const searchTermAtom = atom<string>('');

// 🎯 debounced 검색어 atom (복잡한 구현)
export const debouncedSearchTermAtom = atom<string>('');
