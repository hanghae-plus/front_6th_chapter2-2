import { useCallback } from "react";
import { useAtom } from "jotai";
import { searchTermAtom } from "../atoms/uiAtom";
import { useDebounce } from "../utils/hooks/useDebounce";

export function useSearch() {
  const [searchTerm, setSearchTerm] = useAtom(searchTermAtom);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value);
    },
    [setSearchTerm]
  );

  const clearSearch = useCallback(() => {
    setSearchTerm("");
  }, [setSearchTerm]);

  return {
    searchTerm,
    debouncedSearchTerm,
    handleSearchChange,
    clearSearch,
  };
}
