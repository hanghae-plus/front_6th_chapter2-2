import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { type ProductWithUI, initialProducts } from '../consts';

export const productsAtom = atomWithStorage<ProductWithUI[]>('products', initialProducts);

export const addProductAtom = atom(null, (get, set, newProduct: Omit<ProductWithUI, 'id'>) => {
  const product: ProductWithUI = {
    ...newProduct,
    id: `p${Date.now()}`,
  };
  set(productsAtom, [...get(productsAtom), product]);
});

export const updateProductAtom = atom(
  null,
  (get, set, productId: string, updates: Partial<ProductWithUI>) => {
    set(
      productsAtom,
      get(productsAtom).map((product) =>
        product.id === productId ? { ...product, ...updates } : product
      )
    );
  }
);

export const deleteProductAtom = atom(null, (get, set, productId: string) => {
  set(
    productsAtom,
    get(productsAtom).filter((product) => product.id !== productId)
  );
});
