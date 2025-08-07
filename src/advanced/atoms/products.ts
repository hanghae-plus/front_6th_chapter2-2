import { atom } from "jotai";
import { ProductWithUI } from "../../types";
import { initialProducts } from "../constants";

const getInitialProducts = (): Array<ProductWithUI> => {
  try {
    const stored = localStorage.getItem("products");
    return stored ? JSON.parse(stored) : initialProducts;
  } catch {
    return initialProducts;
  }
};

export const productsAtom = atom<Array<ProductWithUI>>([]);

export const productsWithLocalStorageAtom = atom(
  (get) => {
    const currentProducts = get(productsAtom);
    if (currentProducts.length === 0) {
      return getInitialProducts();
    }
    return currentProducts;
  },
  (_get, set, newProducts: Array<ProductWithUI>) => {
    set(productsAtom, newProducts);
    localStorage.setItem("products", JSON.stringify(newProducts));
  }
);

export const addProductAtom = atom(
  null,
  (get, set, newProduct: Omit<ProductWithUI, "id">) => {
    const products = get(productsWithLocalStorageAtom);
    const product: ProductWithUI = {
      ...newProduct,
      id: `p${Date.now()}`,
    };
    const updatedProducts = [...products, product];
    set(productsWithLocalStorageAtom, updatedProducts);
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
    const products = get(productsWithLocalStorageAtom);
    const updatedProducts = products.map((product) =>
      product.id === productId ? { ...product, ...updates } : product
    );
    set(productsWithLocalStorageAtom, updatedProducts);
  }
);

export const deleteProductAtom = atom(null, (get, set, productId: string) => {
  const products = get(productsWithLocalStorageAtom);
  const updatedProducts = products.filter((p) => p.id !== productId);
  set(productsWithLocalStorageAtom, updatedProducts);
});
