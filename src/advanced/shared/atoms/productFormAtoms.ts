import { atom } from 'jotai';
import type { ProductFormData as ProductFormDataType } from '../../../types';
import type { ProductWithUI } from '../types';
import { DEFAULT_PRODUCT_FORM } from '../../constants/productForm';
import {
  parseNumericValue,
  validatePrice,
  validateStock,
  addDiscount,
  removeDiscount,
  updateDiscount,
  formToProduct,
  productToForm,
  resetProductForm,
} from '../../models/productForm';

/**
 * 상품 폼 데이터 atom
 */
export const productFormAtom = atom<ProductFormDataType>(DEFAULT_PRODUCT_FORM);

/**
 * 편집 중인 상품 ID atom (null이면 새 상품, 'new'는 추가 모드)
 */
export const editingProductAtom = atom<string | null>(null);

/**
 * 상품 폼 표시 여부 atom
 */
export const showProductFormAtom = atom<boolean>(false);

// === 파생 atoms (derived atoms) ===

/**
 * 상품명 업데이트 액션 atom
 */
export const updateProductNameAtom = atom(null, (get, set, name: string) => {
  const currentForm = get(productFormAtom);
  set(productFormAtom, { ...currentForm, name });
});

/**
 * 상품 설명 업데이트 액션 atom
 */
export const updateProductDescriptionAtom = atom(null, (get, set, description: string) => {
  const currentForm = get(productFormAtom);
  set(productFormAtom, { ...currentForm, description });
});

/**
 * 상품 가격 업데이트 액션 atom
 */
export const updateProductPriceAtom = atom(null, (get, set, value: string) => {
  const parsedValue = parseNumericValue(value);
  if (parsedValue !== null) {
    const currentForm = get(productFormAtom);
    set(productFormAtom, { ...currentForm, price: parsedValue });
  }
});

/**
 * 상품 재고 업데이트 액션 atom
 */
export const updateProductStockAtom = atom(null, (get, set, value: string) => {
  const parsedValue = parseNumericValue(value);
  if (parsedValue !== null) {
    const currentForm = get(productFormAtom);
    set(productFormAtom, { ...currentForm, stock: parsedValue });
  }
});

/**
 * 가격 유효성 검증 액션 atom
 */
export const validatePriceAtom = atom(null, (get, set, value: string, callback: (message: string) => void) => {
  const parsedValue = parseNumericValue(value);
  if (parsedValue !== null) {
    const result = validatePrice(parsedValue);
    if (!result.isValid) {
      callback(result.message);
    }
    if (result.correctedValue !== parsedValue) {
      const currentForm = get(productFormAtom);
      set(productFormAtom, { ...currentForm, price: result.correctedValue });
    }
  }
});

/**
 * 재고 유효성 검증 액션 atom
 */
export const validateStockAtom = atom(null, (get, set, value: string, callback: (message: string) => void) => {
  const parsedValue = parseNumericValue(value);
  if (parsedValue !== null) {
    const result = validateStock(parsedValue);
    if (!result.isValid) {
      callback(result.message);
    }
    if (result.correctedValue !== parsedValue) {
      const currentForm = get(productFormAtom);
      set(productFormAtom, { ...currentForm, stock: result.correctedValue });
    }
  }
});

/**
 * 할인 정책 추가 액션 atom
 */
export const addDiscountPolicyAtom = atom(null, (get, set) => {
  const currentForm = get(productFormAtom);
  const updatedDiscounts = addDiscount(currentForm.discounts);
  set(productFormAtom, { ...currentForm, discounts: updatedDiscounts });
});

/**
 * 할인 정책 제거 액션 atom
 */
export const removeDiscountPolicyAtom = atom(null, (get, set, index: number) => {
  const currentForm = get(productFormAtom);
  const updatedDiscounts = removeDiscount(currentForm.discounts, index);
  set(productFormAtom, { ...currentForm, discounts: updatedDiscounts });
});

/**
 * 할인 수량 업데이트 액션 atom
 */
export const updateDiscountQuantityAtom = atom(null, (get, set, index: number, quantity: number) => {
  const currentForm = get(productFormAtom);
  const updatedDiscounts = updateDiscount(currentForm.discounts, index, { quantity });
  set(productFormAtom, { ...currentForm, discounts: updatedDiscounts });
});

/**
 * 할인 비율 업데이트 액션 atom
 */
export const updateDiscountRateAtom = atom(null, (get, set, index: number, rate: number) => {
  const currentForm = get(productFormAtom);
  const updatedDiscounts = updateDiscount(currentForm.discounts, index, { rate });
  set(productFormAtom, { ...currentForm, discounts: updatedDiscounts });
});

/**
 * 상품 편집 시작 액션 atom
 */
export const startEditProductAtom = atom(null, (get, set, product: ProductWithUI) => {
  set(editingProductAtom, product.id);
  set(productFormAtom, productToForm(product));
  set(showProductFormAtom, true);
});

/**
 * 새 상품 추가 시작 액션 atom
 */
export const startAddProductAtom = atom(null, (get, set) => {
  set(editingProductAtom, 'new');
  set(productFormAtom, resetProductForm());
  set(showProductFormAtom, true);
});

/**
 * 상품 폼 리셋 액션 atom
 */
export const resetProductFormAtom = atom(null, (get, set) => {
  set(productFormAtom, resetProductForm());
  set(editingProductAtom, null);
  set(showProductFormAtom, false);
});

/**
 * 상품 폼 제출 액션 atom
 */
export const submitProductFormAtom = atom(
  null,
  (get, set, onSubmit: (product: Omit<ProductWithUI, 'id'>, productId?: string) => void) => {
    const currentForm = get(productFormAtom);
    const editingProduct = get(editingProductAtom);

    const productData = formToProduct(currentForm);

    if (editingProduct && editingProduct !== 'new') {
      onSubmit(productData, editingProduct);
    } else {
      onSubmit(productData);
    }

    // 폼 리셋
    set(productFormAtom, resetProductForm());
    set(editingProductAtom, null);
    set(showProductFormAtom, false);
  },
);
