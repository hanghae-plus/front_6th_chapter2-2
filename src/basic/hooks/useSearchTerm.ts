import { useState } from "react";
import { SEARCH_DELAY } from "../constants/time";
import { useDebounce } from "../utils/hooks/useDebounce";

export const useSearchTerm = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, SEARCH_DELAY);

  const handleSearchTerm = (value: string) => {
    setSearchTerm(value);
  };

  return {
    searchTerm,
    debouncedSearchTerm,
    handleSearchTerm,
  };
};
