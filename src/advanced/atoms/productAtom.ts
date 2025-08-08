// atoms/productsAtom.ts
import { atom } from 'jotai';

import { ProductWithUI } from '../components/AppContainer';
import { initialProducts } from '../constants';

// ✅ localStorage에서 초기값 가져오기 함수
const getInitialProducts = (): ProductWithUI[] => {
  const saved = localStorage.getItem('products');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return initialProducts;
    }
  }
  return initialProducts;
};

// ✅ 전역 상태 atom 정의
export const productsAtom = atom<ProductWithUI[]>(getInitialProducts());
