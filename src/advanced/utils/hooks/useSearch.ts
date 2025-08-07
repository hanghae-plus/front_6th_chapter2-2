import { useState } from 'react';
import { useDebounce } from './useDebounce';

interface UseSearchOptions {
  delay?: number;
  initialValue?: string;
}

interface UseSearchReturn {
  searchTerm: string;
  debouncedSearchTerm: string;
  setSearchTerm: (term: string) => void;
  clearSearch: () => void;
  isSearching: boolean;
}

export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
  const { delay = 500, initialValue = '' } = options;

  const [searchTerm, setSearchTerm] = useState(initialValue);
  const debouncedSearchTerm = useDebounce(searchTerm, delay);

  const clearSearch = () => {
    setSearchTerm('');
  };

  const isSearching = debouncedSearchTerm.trim().length > 0;

  return {
    searchTerm,
    debouncedSearchTerm,
    setSearchTerm,
    clearSearch,
    isSearching,
  };
}
