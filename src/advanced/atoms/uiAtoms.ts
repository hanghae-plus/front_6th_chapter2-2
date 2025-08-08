import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// UI 상태 atoms - localStorage와 동기화
export const isAdminAtom = atomWithStorage<boolean>('isAdmin', false);
export const activeTabAtom = atomWithStorage<'products' | 'coupons'>('activeTab', 'products');
export const searchTermAtom = atomWithStorage<string>('searchTerm', '');

// 디바운스된 검색어 (derived atom) - localStorage와 동기화
export const debouncedSearchTermAtom = atomWithStorage<string>('debouncedSearchTerm', '');

export const setSearchTermAtom = atom(null, (get, set, searchTerm: string) => {
  set(searchTermAtom, searchTerm);

  // 기존 타이머 클리어를 위한 참조
  const timeoutId = setTimeout(() => {
    set(debouncedSearchTermAtom, searchTerm);
  }, 500);

  return timeoutId;
});
