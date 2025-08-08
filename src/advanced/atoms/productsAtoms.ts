import { atom } from 'jotai';

import { Product } from '../../types';
import { initialProducts } from '../constants';

export const productsAtom = atom<Product[]>(initialProducts);
