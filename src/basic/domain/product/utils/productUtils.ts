import { ProductWithUI } from "../models";

export interface ProductFormData {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Array<{ quantity: number; rate: number }>;
}

/**
 * 상품 ID를 생성하는 순수 함수
 */
const generateProductId = (): string => {
  return Date.now().toString();
};

/**
 * 상품 객체를 생성하는 순수 함수
 */
export const createProduct = (
  productData: Omit<ProductWithUI, "id">
): ProductWithUI => {
  return {
    ...productData,
    id: generateProductId(),
  };
};

/**
 * 상품 목록에 새 상품을 추가하는 순수 함수
 */
export const addProductToList = (
  products: ProductWithUI[],
  product: ProductWithUI
): ProductWithUI[] => {
  return [...products, product];
};

/**
 * 상품 목록에서 특정 상품을 업데이트하는 순수 함수
 */
export const updateProductInList = (
  products: ProductWithUI[],
  productId: string,
  updates: Partial<ProductWithUI>
): ProductWithUI[] => {
  return products.map((product) =>
    product.id === productId ? { ...product, ...updates } : product
  );
};

/**
 * 상품 목록에서 특정 상품을 제거하는 순수 함수
 */
export const removeProductFromList = (
  products: ProductWithUI[],
  productId: string
): ProductWithUI[] => {
  return products.filter((product) => product.id !== productId);
};
