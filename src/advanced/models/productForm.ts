import { ProductWithUI } from '../shared/types';
import { validator } from '../shared/utils/validators';
import type { ProductFormData as ProductFormDataType } from '../../types';
import { DEFAULT_PRODUCT_FORM } from '../constants/productForm';

/**
 * 입력된 값을 숫자로 파싱하는 순수함수
 * @param value - 입력 문자열
 * @returns 파싱된 숫자 값 또는 null (유효하지 않은 경우)
 */
export const parseNumericValue = (value: string): number | null => {
  const numericString = validator.validateNumericString(value);
  if (numericString === null) return null;
  return numericString === '' ? 0 : parseInt(numericString);
};

/**
 * 가격 유효성 검증하는 순수함수
 * @param price - 검증할 가격
 * @returns 검증 결과 객체
 */
export const validatePrice = (price: number): { isValid: boolean; message: string; correctedValue: number } => {
  return validator.isValidPrice(price);
};

/**
 * 재고 유효성 검증하는 순수함수
 * @param stock - 검증할 재고
 * @returns 검증 결과 객체
 */
export const validateStock = (stock: number): { isValid: boolean; message: string; correctedValue: number } => {
  return validator.isValidStock(stock);
};

/**
 * 할인 정책을 추가하는 순수함수
 * @param discounts - 현재 할인 목록
 * @param newDiscount - 새로운 할인 정책
 * @returns 업데이트된 할인 목록
 */
export const addDiscount = (
  discounts: Array<{ quantity: number; rate: number }>,
  newDiscount: { quantity: number; rate: number } = { quantity: 10, rate: 0.1 },
): Array<{ quantity: number; rate: number }> => [...discounts, newDiscount];

/**
 * 할인 정책을 제거하는 순수함수
 * @param discounts - 현재 할인 목록
 * @param index - 제거할 할인 인덱스
 * @returns 업데이트된 할인 목록
 */
export const removeDiscount = (
  discounts: Array<{ quantity: number; rate: number }>,
  index: number,
): Array<{ quantity: number; rate: number }> => discounts.filter((_, i) => i !== index);

/**
 * 할인 정책을 업데이트하는 순수함수
 * @param discounts - 현재 할인 목록
 * @param index - 업데이트할 할인 인덱스
 * @param updates - 업데이트할 값들
 * @returns 업데이트된 할인 목록
 */
export const updateDiscount = (
  discounts: Array<{ quantity: number; rate: number }>,
  index: number,
  updates: Partial<{ quantity: number; rate: number }>,
): Array<{ quantity: number; rate: number }> =>
  discounts.map((discount, i) => (i === index ? { ...discount, ...updates } : discount));

/**
 * 폼 데이터를 상품 객체로 변환하는 순수함수
 * @param formData - 폼 데이터
 * @returns 상품 객체 (id 제외)
 */
export const formToProduct = (formData: ProductFormDataType): Omit<ProductWithUI, 'id'> => ({
  name: formData.name,
  price: formData.price,
  stock: formData.stock,
  description: formData.description,
  discounts: formData.discounts,
});

/**
 * 상품 객체를 폼 데이터로 변환하는 순수함수
 * @param product - 상품 객체
 * @returns 폼 데이터
 */
export const productToForm = (product: ProductWithUI): ProductFormDataType => ({
  name: product.name,
  price: product.price,
  stock: product.stock,
  description: product.description || '',
  discounts: product.discounts || [],
});

/**
 * 폼을 기본값으로 리셋하는 순수함수
 * @returns 기본 폼 상태
 */
export const resetProductForm = (): ProductFormDataType => ({ ...DEFAULT_PRODUCT_FORM });
