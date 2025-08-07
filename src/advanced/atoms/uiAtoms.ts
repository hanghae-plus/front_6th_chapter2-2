// atoms/uiAtoms.ts
import { atom } from 'jotai';

// UI 상태 atoms
export const isAdminAtom = atom(false);
export const activeTabAtom = atom<'products' | 'coupons'>('products');
export const showProductFormAtom = atom(false);
export const showCouponFormAtom = atom(false);
export const searchTermAtom = atom('');

// 파생 atom: 디바운스된 검색어
export const debouncedSearchTermAtom = atom(get => {
  const searchTerm = get(searchTermAtom);
  // 실제 debounce 로직은 useDebounce hook에서 처리
  return searchTerm;
});
