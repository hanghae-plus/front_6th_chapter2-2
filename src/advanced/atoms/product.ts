import { atom } from 'jotai';
import type { ProductWithUI } from '../../types';
import { initialProducts } from '../constants';

export const productsAtom = atom<ProductWithUI[]>(initialProducts);
