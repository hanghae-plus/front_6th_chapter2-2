import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import { productData } from "@/advanced/features/product/data/product.data";
import { ProductWithUI } from "@/advanced/features/product/types/product";

export const productsAtom = atomWithStorage<ProductWithUI[]>(
  "products",
  productData.initialProducts
);

export const addProductAtom = atom(
  null,
  (get, set, newProduct: Omit<ProductWithUI, "id">) => {
    const newItem: ProductWithUI = {
      ...newProduct,
      id: `p${Date.now()}`,
    };
    set(productsAtom, [...get(productsAtom), newItem]);
  }
);

export const updateProductAtom = atom(
  null,
  (
    get,
    set,
    { id, updates }: { id: string; updates: Partial<ProductWithUI> }
  ) => {
    set(
      productsAtom,
      get(productsAtom).map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }
);

export const deleteProductAtom = atom(null, (get, set, id: string) => {
  set(
    productsAtom,
    get(productsAtom).filter((p) => p.id !== id)
  );
});
