import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { initialProducts } from '../data/products';
import type { ProductViewModel } from '../entities/ProductViewModel.ts';

const productsAtom = atomWithStorage<ProductViewModel[]>("products", initialProducts)

export function useProducts() {
  const [products, setProducts] = useAtom(productsAtom)

  return { products, setProducts }
}