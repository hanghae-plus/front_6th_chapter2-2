import { atom } from 'jotai';

import { initialProducts } from '../constants';
import { Product } from '../types';

export const productsAtom = atom<Product[]>(initialProducts);
