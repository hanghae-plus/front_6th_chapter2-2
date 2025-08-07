import { useState } from 'react';
import { useDebounce } from './useDebounce';

/**
 * 검색 기능을 관리하는 커스텀 Hook
 *
 * 기능:
 * - 검색어 상태 관리
 * - 디바운스된 검색어 제공 (500ms 지연)
 *
 * @returns { searchTerm, setSearchTerm, debouncedSearchTerm }
 */
export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
  };
};
