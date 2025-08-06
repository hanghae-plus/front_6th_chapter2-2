import { ProductWithUI } from "./product.types";
import { generateId } from "../../utils/idGenerator";

/**
 * 상품 비즈니스 로직 모델
 */
export const productModel = {
  /**
   * 상품 추가
   * @param products 현재 상품 목록
   * @param newProduct 새로운 상품 데이터 (ID 제외)
   * @returns 업데이트된 상품 목록
   */
  addProduct: (
    products: ProductWithUI[],
    newProduct: Omit<ProductWithUI, "id">
  ): ProductWithUI[] => {
    const product: ProductWithUI = {
      ...newProduct,
      id: generateId("product"),
    };

    return [...products, product];
  },

  /**
   * 상품 수정
   * @param products 현재 상품 목록
   * @param productId 수정할 상품 ID
   * @param updates 수정할 데이터
   * @returns 업데이트된 상품 목록
   */
  updateProduct: (
    products: ProductWithUI[],
    productId: string,
    updates: Partial<ProductWithUI>
  ): ProductWithUI[] => {
    return products.map((product) =>
      product.id === productId ? { ...product, ...updates } : product
    );
  },

  /**
   * 상품 삭제
   * @param products 현재 상품 목록
   * @param productId 삭제할 상품 ID
   * @returns 업데이트된 상품 목록
   */
  deleteProduct: (
    products: ProductWithUI[],
    productId: string
  ): ProductWithUI[] => {
    return products.filter((product) => product.id !== productId);
  },

  /**
   * 상품 ID로 상품 찾기
   * @param products 상품 목록
   * @param productId 찾을 상품 ID
   * @returns 찾은 상품 또는 undefined
   */
  findProductById: (
    products: ProductWithUI[],
    productId: string
  ): ProductWithUI | undefined => {
    return products.find((product) => product.id === productId);
  },

  /**
   * 상품명으로 상품 검색
   * @param products 상품 목록
   * @param query 검색어
   * @returns 필터링된 상품 목록
   */
  searchProducts: (
    products: ProductWithUI[],
    query: string
  ): ProductWithUI[] => {
    if (!query.trim()) return products;

    const normalizedQuery = query.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(normalizedQuery) ||
        (product.description &&
          product.description.toLowerCase().includes(normalizedQuery))
    );
  },

  /**
   * 상품이 존재하는지 확인
   * @param products 상품 목록
   * @param productId 확인할 상품 ID
   * @returns 존재 여부
   */
  isProductExists: (products: ProductWithUI[], productId: string): boolean => {
    return products.some((product) => product.id === productId);
  },
};
