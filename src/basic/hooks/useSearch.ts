import { useState, useEffect } from "react";

export interface IUseSearchOptions {
  delay?: number;
  initialValue?: string;
}

export const useSearch = ({ delay = 500, initialValue = "" }: IUseSearchOptions = {}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, delay);

    return () => clearTimeout(timer);
  }, [searchTerm, delay]);

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
  };
};
