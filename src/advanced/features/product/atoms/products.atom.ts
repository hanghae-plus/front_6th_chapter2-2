import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import { productData } from "@/advanced/features/product/data/product.data";
import { ProductWithUI } from "@/advanced/features/product/types/product";

const products = atomWithStorage<ProductWithUI[]>(
  "products",
  productData.initialProducts
);

const addProduct = atom(
  null,
  (get, set, newProduct: Omit<ProductWithUI, "id">) => {
    const newItem: ProductWithUI = {
      ...newProduct,
      id: `p${Date.now()}`,
    };
    set(products, [...get(products), newItem]);
  }
);

const updateProduct = atom(
  null,
  (
    get,
    set,
    { id, updates }: { id: string; updates: Partial<ProductWithUI> }
  ) => {
    set(
      products,
      get(products).map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }
);

const deleteProduct = atom(null, (get, set, id: string) => {
  set(
    products,
    get(products).filter((p) => p.id !== id)
  );
});

export default {
  products,
  addProduct,
  updateProduct,
  deleteProduct,
};
