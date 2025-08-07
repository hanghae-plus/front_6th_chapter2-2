import { useMemo } from 'react';
import { ProductWithUI } from '../shared/types';
import { useSearch } from '../shared/hooks';
import { filterProductsBySearchTerm } from '../models/productSearch';

/**
 * 상품 검색을 위한 전용 훅
 * @param products - 검색할 상품 목록
 * @param delay - 디바운스 지연 시간
 * @returns 검색 관련 상태와 필터링된 상품들
 */
export function useProductSearch(products: ProductWithUI[], delay: number = 500) {
  const { searchTerm, setSearchTerm, debouncedSearchTerm, clearSearch, hasSearchTerm } = useSearch(delay);

  /**
   * 검색어로 필터링된 상품 목록
   */
  const filteredProducts = useMemo(() => {
    return filterProductsBySearchTerm(products, debouncedSearchTerm);
  }, [products, debouncedSearchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    clearSearch,
    hasSearchTerm,
    filteredProducts,
  };
}
