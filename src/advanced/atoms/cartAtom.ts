import { atom } from 'jotai';
import { CartItem } from '../../types';

const getInitialCart = (): CartItem[] => {
  const saved = localStorage.getItem('cart');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }
  return [];
};

export const cartAtom = atom<CartItem[]>(getInitialCart());
