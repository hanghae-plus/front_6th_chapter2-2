import { ProductWithUI } from "./product";

/**
 * 상품 검색 필터링 함수
 * 상품명과 설명에서 검색어를 찾아 필터링
 */
export const filterProductsBySearchTerm = (
  products: ProductWithUI[],
  searchTerm: string
): ProductWithUI[] => {
  if (!searchTerm.trim()) {
    return products;
  }

  const normalizedSearchTerm = searchTerm.toLowerCase().trim();

  return products.filter((product) => {
    const matchesName = product.name
      .toLowerCase()
      .includes(normalizedSearchTerm);

    const matchesDescription = product.description
      ? product.description.toLowerCase().includes(normalizedSearchTerm)
      : false;

    return matchesName || matchesDescription;
  });
};

/**
 * 검색어 정규화 함수
 */
export const normalizeSearchTerm = (searchTerm: string): string => {
  return searchTerm.toLowerCase().trim();
};

/**
 * 검색 결과가 있는지 확인하는 함수
 */
export const hasSearchResults = (
  products: ProductWithUI[],
  searchTerm: string
): boolean => {
  if (!searchTerm.trim()) {
    return true;
  }

  return filterProductsBySearchTerm(products, searchTerm).length > 0;
};
