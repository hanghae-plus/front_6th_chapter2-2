import { useEffect, useState } from "react";

import { SEARCH } from "@/basic/constants";

export function useSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, SEARCH.DEBOUNCE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  return { searchTerm, debouncedSearchTerm, handleInputChange };
}
