import { atom } from 'jotai';
import type { ProductWithUI } from '../../types';
import { initialProducts } from '../constants';
import * as productModel from '../models/product';

export const productsAtom = atom<ProductWithUI[]>(initialProducts);

export const addProductAtom = atom(
  null,
  (get, set, { newProduct }: { newProduct: ProductWithUI }) => {
    const products = get(productsAtom);

    const newProducts = productModel.addProduct({
      newProduct,
      products,
    });

    set(productsAtom, newProducts);
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
    const products = get(productsAtom);

    const newProducts = productModel.updateProduct({
      productId,
      updates,
      products,
    });

    set(productsAtom, newProducts);
  }
);

export const deleteProductAtom = atom(
  null,
  (get, set, { productId }: { productId: string }) => {
    const products = get(productsAtom);

    const newProducts = productModel.deleteProduct({ productId, products });

    set(productsAtom, newProducts);
  }
);
