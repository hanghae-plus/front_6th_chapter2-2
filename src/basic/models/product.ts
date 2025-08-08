import { Product } from "../../types";

export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

/**
 * 상품 가격을 포맷팅하는 함수
 */
export const formatPrice = (
  price: number,
  hasUnit: boolean,
  isSoldOut?: boolean
): string => {
  if (isSoldOut) {
    return "SOLD OUT";
  }

  if (hasUnit) {
    return `${price.toLocaleString()}원`;
  }

  return `₩${price.toLocaleString()}`;
};

/**
 * 새로운 상품 ID를 생성하는 함수
 */
export const generateProductId = (): string => {
  return `p${Date.now()}`;
};

/**
 * 상품을 추가하는 함수
 */
export const addProduct = (
  products: ProductWithUI[],
  newProduct: Omit<ProductWithUI, "id">
): ProductWithUI[] => {
  const product: ProductWithUI = {
    ...newProduct,
    id: generateProductId(),
  };
  return [...products, product];
};

/**
 * 상품을 업데이트하는 함수
 */
export const updateProduct = (
  products: ProductWithUI[],
  productId: string,
  updates: Partial<ProductWithUI>
): ProductWithUI[] => {
  return products.map((product) =>
    product.id === productId ? { ...product, ...updates } : product
  );
};

/**
 * 상품을 삭제하는 함수
 */
export const deleteProduct = (
  products: ProductWithUI[],
  productId: string
): ProductWithUI[] => {
  return products.filter((p) => p.id !== productId);
};

/**
 * 상품을 검색/필터링하는 함수
 */
export const filterProducts = (
  products: ProductWithUI[],
  searchTerm: string
): ProductWithUI[] => {
  if (!searchTerm) {
    return products;
  }

  const lowerSearchTerm = searchTerm.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerSearchTerm) ||
      (product.description &&
        product.description.toLowerCase().includes(lowerSearchTerm))
  );
};

/**
 * 상품의 최대 할인율을 계산하는 함수
 */
export const getMaxDiscountRate = (product: Product): number => {
  if (product.discounts.length === 0) {
    return 0;
  }
  return Math.max(...product.discounts.map((d) => d.rate));
};
