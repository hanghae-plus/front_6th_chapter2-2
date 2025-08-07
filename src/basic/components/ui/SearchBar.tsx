import Input from "./Input";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  searchTerm,
  setSearchTerm,
  placeholder = "상품 검색...",
  className = "",
}: SearchBarProps) {
  return (
    <Input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder={placeholder}
      className={`px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 ${className}`}
    />
  );
}
