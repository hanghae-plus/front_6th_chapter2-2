import { useAtomValue, useSetAtom } from "jotai";

import {
  addProductAtom,
  deleteProductAtom,
  productsAtom,
  updateProductAtom,
} from "@/advanced/features/product/atoms/products.atom";

export function useProducts() {
  return {
    products: useAtomValue(productsAtom),
    addProduct: useSetAtom(addProductAtom),
    updateProduct: useSetAtom(updateProductAtom),
    deleteProduct: useSetAtom(deleteProductAtom),
  };
}
