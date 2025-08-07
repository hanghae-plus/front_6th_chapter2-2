import { useAtom } from 'jotai';
import { useDebounce } from './useDebounce';
import { searchTermAtom } from '../atoms/uiAtoms';

/**
 * 검색 기능을 관리하는 커스텀 Hook (Jotai 버전)
 *
 * 기능:
 * - 검색어 상태 관리 (Jotai atoms 사용)
 * - 디바운스된 검색어 제공 (500ms 지연)
 *
 * @returns { searchTerm, setSearchTerm, debouncedSearchTerm }
 */
export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useAtom(searchTermAtom);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
  };
};
