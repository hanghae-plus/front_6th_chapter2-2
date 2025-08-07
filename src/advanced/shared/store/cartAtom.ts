import { atomWithStorage } from 'jotai/utils';
import { CartItem } from '../../../types';

// localStorage와 자동 동기화되는 cart atom
export const cartAtom = atomWithStorage<CartItem[]>('cart', []);