import { useState, useCallback } from "react";
import { useDebounce } from "../utils/hooks/useDebounce";

export const useSearch = (delay: number = 500) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, delay);

  const updateSearchTerm = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  return {
    searchTerm,
    debouncedSearchTerm,
    setSearchTerm: updateSearchTerm,
    clearSearch,
  };
};
