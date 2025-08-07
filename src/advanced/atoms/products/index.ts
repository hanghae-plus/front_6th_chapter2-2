import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai";
import { ProductWithUI } from "../../types";
import { INITIAL_PRODUCTS } from "../../constants";
import { addNotificationAtom } from "../notifications";

// 상품 목록 (localStorage 연동)
export const productsAtom = atomWithStorage<ProductWithUI[]>(
  "products", 
  INITIAL_PRODUCTS
);

// 상품 추가 액션
export const addProductAtom = atom(
  null,
  (get, set, newProduct: Omit<ProductWithUI, "id">) => {
    const products = get(productsAtom);
    const product: ProductWithUI = {
      ...newProduct,
      id: `p${Date.now()}`,
    };
    set(productsAtom, [...products, product]);
    set(addNotificationAtom, "상품이 추가되었습니다.", "success");
  }
);

// 상품 수정 액션
export const updateProductAtom = atom(
  null,
  (get, set, productId: string, updates: Partial<ProductWithUI>) => {
    const products = get(productsAtom);
    set(productsAtom, products.map((product) =>
      product.id === productId ? { ...product, ...updates } : product
    ));
    set(addNotificationAtom, "상품이 수정되었습니다.", "success");
  }
);

// 상품 삭제 액션
export const deleteProductAtom = atom(
  null,
  (get, set, productId: string) => {
    const products = get(productsAtom);
    set(productsAtom, products.filter((p) => p.id !== productId));
    set(addNotificationAtom, "상품이 삭제되었습니다.", "success");
  }
);

// ========== 검색 관련 아톰들 ==========

// 검색어 상태
export const searchTermAtom = atom("");

// 필터링된 상품 목록 (파생 상태)
export const filteredProductsAtom = atom((get) => {
  const products = get(productsAtom);
  const searchTerm = get(searchTermAtom);
  
  if (!searchTerm.trim()) return products;
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerSearchTerm) ||
      (product.description && 
       product.description.toLowerCase().includes(lowerSearchTerm))
  );
});