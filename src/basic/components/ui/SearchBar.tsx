import { SearchIcon } from '../icons/SearchIcon.tsx';
import { CloseIcon } from '../icons/CloseIcon.tsx';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar = ({
  searchTerm,
  onSearchChange,
  placeholder = '상품 검색...',
  className = '',
}: SearchBarProps) => {
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={searchTerm}
        onChange={e => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 pr-10"
      />

      {/* 검색 아이콘 */}
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
        <SearchIcon />
      </div>

      {/* 검색어 지우기 버튼 */}
      {searchTerm && (
        <button
          onClick={() => onSearchChange('')}
          className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="검색어 지우기"
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
};
