import { atom } from 'jotai';

// UI 상태 atoms
export const isAdminAtom = atom<boolean>(false);
export const activeTabAtom = atom<'products' | 'coupons'>('products');
export const searchTermAtom = atom<string>('');

// 디바운스된 검색어 (derived atom)
export const debouncedSearchTermAtom = atom<string>('');

export const setSearchTermAtom = atom(null, (get, set, searchTerm: string) => {
  set(searchTermAtom, searchTerm);

  // 기존 타이머 클리어를 위한 참조
  const timeoutId = setTimeout(() => {
    set(debouncedSearchTermAtom, searchTerm);
  }, 500);

  return timeoutId;
});
