import { useEffect, useState } from 'react';

export const useDebounce = () => {
  const [searchTerm, setSearchTerm] = useState(''); // 검색어
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(''); // 디바운스된 검색어

  // 검색어 디바운싱 (500ms 지연)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
  };
};
