import { useState, useCallback, useMemo } from "react";
import { useDebounce } from "./useDebounce";
import { useAtomValue } from "jotai";

// models
import { searchProducts } from "../../models/product";

// stores
import { productsAtom } from "../../stores/productStore";

interface UseSearchOptions {
  debounceMs?: number;
}

/**
 * 상품 검색을 위한 커스텀 훅
 * @param options - 검색 옵션 (debounce 시간)
 */
export const useSearch = <T>(
  data: T[],
  searchFn: (items: T[], term: string) => T[],
  options: UseSearchOptions = {}
) => {
  const { debounceMs = 500 } = options;

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);

  // 새로운 models의 searchProducts 함수 사용
  const filteredProducts = useMemo(() => {
    return searchFn(data, debouncedSearchTerm);
  }, [data, debouncedSearchTerm, searchFn]);

  // 검색 상태 정보
  const searchInfo = {
    isSearching: Boolean(debouncedSearchTerm.trim()),
    searchTerm: debouncedSearchTerm,
    resultCount: filteredProducts.length,
    totalCount: data.length,
    hasResults: filteredProducts.length > 0,
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
