import { SearchIcon } from '../icons/SearchIcon.tsx';
import { CloseIcon } from '../icons/CloseIcon.tsx';
import { useAtom } from 'jotai';
import { useSetAtom } from 'jotai/index';
import {
  debouncedSearchTermAtom,
  searchTermAtom,
} from '../../store/common/search.store.ts';
import { useEffect } from 'react';

interface SearchBarProps {
  className?: string;
}

export const SearchBar = ({ className = '' }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useAtom(searchTermAtom);
  const setDebouncedSearchTerm = useSetAtom(debouncedSearchTermAtom);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, setDebouncedSearchTerm]);

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder={'상품 검색...'}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 pr-10"
      />

      {/* 검색 아이콘 */}
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
        <SearchIcon />
      </div>

      {/* 검색어 지우기 버튼 */}
      {searchTerm && (
        <button
          onClick={() => setSearchTerm('')}
          className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="검색어 지우기"
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
};
