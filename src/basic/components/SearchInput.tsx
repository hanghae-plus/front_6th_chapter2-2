interface SearchInputProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchInput = ({
  searchTerm,
  setSearchTerm,
  placeholder = '상품 검색...',
  className = 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
}: SearchInputProps) => {
  return (
    <input
      type="text"
      value={searchTerm}
      onChange={e => setSearchTerm(e.target.value)}
      placeholder={placeholder}
      className={className}
    />
  );
};

export default SearchInput;
