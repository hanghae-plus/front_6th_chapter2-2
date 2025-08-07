import { atomWithStorage } from 'jotai/utils';
import { ProductWithUI } from '../../types';
import { initialProducts } from '../data/mockProducts';

export const productsAtom = atomWithStorage<ProductWithUI[]>('products', initialProducts, {
  getItem: (key: string, initialValue: ProductWithUI[]) => {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialValue;
      }
    }
    return initialValue;
  },
  setItem: (key: string, value: ProductWithUI[]) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('localStorage setItem error:', error);
    }
  },
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('localStorage removeItem error:', error);
    }
  },
});
