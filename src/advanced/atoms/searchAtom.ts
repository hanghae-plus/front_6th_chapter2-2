import { atom } from 'jotai';

// 검색어 atom
export const searchQueryAtom = atom<string>('');

// 디바운스된 검색어 atom (useSearch에서 수동 관리)
export const debouncedSearchQueryAtom = atom<string>('');
