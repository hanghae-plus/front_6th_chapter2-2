import { FC } from "react";
import { useAtom } from "jotai";
import { searchTermAtom, setSearchTermAtom } from "../../store";

export const SearchBar: FC = () => {
  const [searchTerm] = useAtom(searchTermAtom);
  const [, setSearchTerm] = useAtom(setSearchTermAtom);

  return (
    <input
      type="text"
      placeholder="상품 검색..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
    />
  );
};
