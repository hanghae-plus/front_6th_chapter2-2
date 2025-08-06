import { atomWithStorage } from "jotai/utils";
import { ProductWithUI } from "../../types";
import { INITIAL_PRODUCTS } from "../../constants";

// 상품 목록 (localStorage 연동)
export const productsAtom = atomWithStorage<ProductWithUI[]>(
  "products", 
  INITIAL_PRODUCTS
);