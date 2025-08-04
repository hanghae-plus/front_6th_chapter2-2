import { FC } from "react";

// props 타입 정의
interface SearchBarProps {
  searchTerm: string;
  onSearch: (term: string) => void;
}

export const SearchBar: FC<SearchBarProps> = ({ searchTerm, onSearch }) => (
  <input
    type="text"
    placeholder="상품 검색..."
    value={searchTerm}
    onChange={(e) => onSearch(e.target.value)}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
  />
);
