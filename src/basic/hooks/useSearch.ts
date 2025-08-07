import { useState, useEffect } from 'react';

const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const setSearchTermValue = (term: string) => {
    setSearchTerm(term);
  };

  return { searchTerm, debouncedSearchTerm, handleSearchTermChange, setSearchTermValue };
};

export { useSearch };
