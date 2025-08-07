import { atom } from "jotai";
import { productsAtom } from "../atoms/productAtoms";
import { searchTermAtom } from "../index";
import { Getter } from "jotai";
import { ProductWithUI } from "../../types";

// 검색어로 필터된 상품 목록 selector
export const filteredProductsAtom = atom((get: Getter) => {
  const products = get(productsAtom);
  const searchTerm = get(searchTermAtom);
  if (!searchTerm) return products;
  const lowercasedTerm = searchTerm.toLowerCase();
  return products.filter(
    (product: ProductWithUI) =>
      product.name.toLowerCase().includes(lowercasedTerm) ||
      (product.description &&
        product.description.toLowerCase().includes(lowercasedTerm))
  );
});
