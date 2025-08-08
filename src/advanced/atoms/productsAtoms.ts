import { Product } from '../../types';
import { initialProducts } from '../constants';
import { atomWithLocalStorage } from '../utils/atom';

export const productsAtom = atomWithLocalStorage<Product[]>('products', initialProducts);
