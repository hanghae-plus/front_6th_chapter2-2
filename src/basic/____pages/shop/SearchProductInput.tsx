interface Props {
  searchTerm: string;
  onChange: (searchTerm: string) => void;
}

function SearchProductInput({ searchTerm, onChange }: Props) {
  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => onChange(e.target.value)}
      placeholder="상품 검색..."
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
    />
  );
}

export default SearchProductInput;
