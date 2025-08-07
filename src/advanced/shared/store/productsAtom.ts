import { atomWithStorage } from 'jotai/utils';
import { ProductWithUI } from '../../entities/product';
import { initialProducts } from '../../entities/product';

// localStorage와 자동 동기화되는 products atom
export const productsAtom = atomWithStorage<ProductWithUI[]>('products', initialProducts);