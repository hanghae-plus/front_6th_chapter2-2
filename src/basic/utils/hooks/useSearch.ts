import { useState, useCallback } from "react";
import { ProductWithUI } from "../../hooks/useProducts";
import { useDebounce } from "./useDebounce";
import { useFilter } from "./useFilter";

interface UseSearchOptions {
  debounceMs?: number;
  searchFields?: (keyof ProductWithUI)[];
}

/**
 * 상품 검색을 위한 커스텀 훅
 * @param products - 검색할 상품 배열
 * @param options - 검색 옵션 (debounce 시간, 검색 필드)
 */
export const useSearch = (products: ProductWithUI[], options: UseSearchOptions = {}) => {
  const { debounceMs = 500, searchFields = ["name", "description"] } = options;

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);

  // 검색 필터 함수를 생성
  const createSearchFilter = useCallback(
    (term: string) => {
      // 검색어가 없으면 모든 상품을 보여주는 필터 함수 반환
      if (!term.trim()) {
        return () => true;
      }

      // 검색어가 있으면 실제 검색하는 필터 함수 반환
      const lowercaseSearch = term.toLowerCase();
      return (product: ProductWithUI) => {
        return searchFields.some((field) => {
          const value = product[field];
          if (typeof value === "string") {
            return value.toLowerCase().includes(lowercaseSearch);
          }
          return false;
        });
      };
    },
    [searchFields]
  );

  // 필터링 적용
  const searchFilter = createSearchFilter(debouncedSearchTerm);
  const { filteredItems: filteredProducts, filterInfo } = useFilter(products, searchFilter);

  // 검색 상태 정보
  const searchInfo = {
    isSearching: Boolean(debouncedSearchTerm.trim()),
    searchTerm: debouncedSearchTerm,
    resultCount: filterInfo.filteredCount,
    totalCount: filterInfo.totalCount,
    hasResults: filterInfo.filteredCount > 0,
  };

  const clearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    filteredProducts,
    searchInfo,
    clearSearch,
  };
};
