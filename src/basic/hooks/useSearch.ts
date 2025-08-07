import { useState, useEffect } from 'react';

export function useSearch(debounceDelay: number = 500) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceDelay);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceDelay]);

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
  };
}
