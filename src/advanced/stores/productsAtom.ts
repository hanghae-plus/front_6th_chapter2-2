import { atomWithStorage } from "jotai/utils";
import { ProductWithUI } from "../type/types";
import { initialProducts } from "../data/initialData";

/**
 * 상품 목록 상태 - localStorage와 동기화
 * 기본값: initialProducts 사용
 */
export const productsAtom = atomWithStorage<ProductWithUI[]>(
  "products",
  initialProducts
);
