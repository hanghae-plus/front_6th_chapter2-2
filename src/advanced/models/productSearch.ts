import { ProductWithUI } from '../shared/types';

/**
 * 검색어를 정규화 (소문자 변환, 공백 제거)
 * @param searchTerm - 원본 검색어
 * @returns 정규화된 검색어
 */
export const normalizeSearchTerm = (searchTerm: string): string => {
  return searchTerm.trim().toLowerCase();
};

/**
 * 상품이 검색어와 매칭되는지 확인
 * @param product - 상품
 * @param normalizedSearchTerm - 정규화된 검색어
 * @returns 매칭 여부
 */
export const matchesProduct = (product: ProductWithUI, normalizedSearchTerm: string): boolean => {
  const nameMatches = product.name.toLowerCase().includes(normalizedSearchTerm);
  const descriptionMatches = product.description?.toLowerCase().includes(normalizedSearchTerm) || false;

  return nameMatches || descriptionMatches;
};

/**
 * 상품 검색 필터링 로직
 * @param products - 검색할 상품 목록
 * @param searchTerm - 검색어
 * @returns 필터링된 상품 목록
 */
export const filterProductsBySearchTerm = (products: ProductWithUI[], searchTerm: string): ProductWithUI[] => {
  const normalized = normalizeSearchTerm(searchTerm);

  if (!normalized) {
    return products;
  }

  return products.filter((product) => matchesProduct(product, normalized));
};
