import { atom } from 'jotai';
import { ProductWithUI } from '../../models/entities';
import { initialProducts } from '../../constant/initValue.ts';
import { atomWithStorage } from 'jotai/utils';
import { debouncedSearchTermAtom } from '../common/search.store.ts';

// 상품 전역상태 관리
export const productAtom = atomWithStorage<ProductWithUI[]>(
  'products',
  initialProducts,
  undefined,
  { getOnInit: true }
);

export const addProductAtom = atom(
  null,
  (get, set, newProduct: Omit<ProductWithUI, 'id'>) => {
    const product: ProductWithUI = {
      ...newProduct,
      id: `p${Date.now()}`,
    };
    const currentProduct = get(productAtom);

    set(productAtom, [...currentProduct, product]);
  }
);

export const updateProductAtom = atom(
  null,
  (
    get,
    set,
    {
      productId,
      updates,
    }: { productId: string; updates: Partial<ProductWithUI> }
  ) => {
    const currentProduct = get(productAtom);
    const updatedProduct = currentProduct.map(product =>
      product.id === productId ? { ...product, ...updates } : product
    );

    set(productAtom, updatedProduct);
  }
);
export const deleteProductAtom = atom(null, (get, set, productId: string) => {
  const currentProducts = get(productAtom);
  const filteredProducts = currentProducts.filter(p => p.id !== productId);
  set(productAtom, filteredProducts);
});

export const filterProductAtom = atom<ProductWithUI[]>(get => {
  const debouncedSearchTerm = get(debouncedSearchTermAtom);
  const products = get(productAtom);

  return debouncedSearchTerm
    ? products.filter(
        product =>
          product.name
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          (product.description &&
            product.description
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase()))
      )
    : products;
});
