import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { CartItem } from '../../types';

// 장바구니 아톰 (로컬스토리지와 연동)
export const cartAtom = atomWithStorage<CartItem[]>('cart', [], {
  getItem: (key: string, initialValue: CartItem[]) => {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsedCart = JSON.parse(saved);
        if (Array.isArray(parsedCart)) {
          return parsedCart.filter(
            (item) =>
              item &&
              item.product &&
              typeof item.product.id === 'string' &&
              typeof item.product.price === 'number' &&
              typeof item.quantity === 'number',
          );
        }
        return initialValue;
      } catch {
        return initialValue;
      }
    }
    return initialValue;
  },
  setItem: (key: string, value: CartItem[]) => {
    if (value.length > 0) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.removeItem(key);
    }
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },
});

// 장바구니 총 아이템 개수 아톰
export const totalCartItemAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.reduce((sum, item) => sum + item.quantity, 0);
});
