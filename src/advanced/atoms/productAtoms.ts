import { atom } from "jotai";
import { NewProductForm } from "../types/product";
import { INITIAL_PRODUCT_FORM } from "../utils/productUtils";

/** 상품 관리 편집 상태 */
export const editingProductAtom = atom<string | null>(null);

/** 상품 폼 표시 상태 */
export const showProductFormAtom = atom<boolean>(false);

/** 상품 폼 데이터 */
export const productFormAtom = atom<NewProductForm>(INITIAL_PRODUCT_FORM);
