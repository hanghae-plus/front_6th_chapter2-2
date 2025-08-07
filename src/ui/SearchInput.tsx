export const SearchInput = ({
  searchTerm,
  setSearchTerm,
  placeholder = '상품 검색...',
  className,
}: {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  placeholder: string;
  className?: string;
}) => {
  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 ${className}`}
    />
  );
};
