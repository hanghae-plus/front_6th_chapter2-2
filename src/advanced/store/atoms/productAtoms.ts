import { atomWithStorage } from "jotai/utils";
import { ProductWithUI } from "../../types";
import { initialProducts } from "../../data";

// 상품 상태 atom
export const productsAtom = atomWithStorage<ProductWithUI[]>(
  "products",
  initialProducts
);
