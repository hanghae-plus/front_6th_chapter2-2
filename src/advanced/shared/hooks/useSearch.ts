import { useState } from "react";
import { useDebounceValue } from "./useDebounceValue";

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounceValue({
    value: searchTerm,
    delay: 500,
  });

  return {
    value: searchTerm,
    change: setSearchTerm,
    debouncedValue: debouncedSearchTerm,
  };
};
