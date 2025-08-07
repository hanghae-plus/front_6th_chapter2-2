import { useState } from 'react';
import { useDebounce } from './useDebounce';
import { SEARCH_DELAY } from '../constants/toast';

/**
 * 검색 기능을 위한 커스텀 훅
 * @param delay - 디바운스 지연 시간 (기본값: 500ms)
 * @returns 검색 관련 상태와 함수들
 */
export function useSearch(delay: number = SEARCH_DELAY) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, delay);

  /**
   * 검색어 초기화
   */
  const clearSearch = () => {
    setSearchTerm('');
  };

  /**
   * 검색어가 있는지 확인
   */
  const hasSearchTerm = debouncedSearchTerm.trim().length > 0;

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    clearSearch,
    hasSearchTerm,
  };
}
