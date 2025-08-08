import { atomWithStorage } from 'jotai/utils';

import { Product } from '../../types';
import { initialProducts } from '../constants';

export const productsAtom = atomWithStorage<Product[]>('products', initialProducts);
