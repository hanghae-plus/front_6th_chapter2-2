interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar = ({ 
  searchTerm, 
  onSearchChange, 
  placeholder = "검색...",
  className = ""
}: SearchBarProps) => {
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 pr-10"
      />
      
      {/* 검색 아이콘 */}
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"  
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      
      {/* 검색어 지우기 버튼 */}
      {searchTerm && (
        <button
          onClick={() => onSearchChange('')}
          className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="검색어 지우기"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};
