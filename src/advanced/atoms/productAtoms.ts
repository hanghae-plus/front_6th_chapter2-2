import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { ProductWithUI } from '../types';
import { searchTermAtom } from './uiAtoms';
import { initialProducts } from '../data/initialData';

export const productsAtom = atomWithStorage<ProductWithUI[]>(
  'products',
  initialProducts
);
export const editingProductAtom = atom<string | null>(null);
export const productFormAtom = atom({
  name: '',
  price: 0,
  stock: 0,
  description: '',
  discounts: [] as Array<{ quantity: number; rate: number }>,
});

// 파생 atom: 검색어로 필터링된 상품 목록 (이름과 설명 모두 검색)
export const filteredProductsAtom = atom(get => {
  const products = get(productsAtom);
  const searchTerm = get(searchTermAtom);

  if (!searchTerm.trim()) return products;

  return products.filter(
    product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
});
