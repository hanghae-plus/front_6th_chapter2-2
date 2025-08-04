import { Dispatch, SetStateAction } from "react";

interface SearchProps {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
}

function NoResults({ debouncedSearchTerm }: { debouncedSearchTerm: string }) {
  return (
    <div className="text-center py-12">
      <p className="text-gray-500">
        "{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.
      </p>
    </div>
  );
}

export function Search({ searchTerm, setSearchTerm }: SearchProps) {
  return (
    <div className="ml-8 flex-1 max-w-md">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="상품 검색..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
      />
    </div>
  );
}

Search.NoResults = NoResults;
