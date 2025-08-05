import { useState } from "react";
import { useDebounce } from "../utils/hooks/useDebounce";

export const useSearchProduct = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  return { searchTerm, handleSearch, debouncedSearchTerm };
};
