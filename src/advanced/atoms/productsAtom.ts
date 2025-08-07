import { atomWithStorage } from 'jotai/utils';
import { ProductWithUI } from '../../types';
import { initialProducts } from '../data/mockProducts';

export const productsAtom = atomWithStorage<ProductWithUI[]>('products', initialProducts, {
  getItem: (key: string, initialValue: ProductWithUI[]) => {
    return initialProducts;
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
