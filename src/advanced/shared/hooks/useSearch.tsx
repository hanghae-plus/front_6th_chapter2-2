import { useAtom } from 'jotai';
import {
  debouncedSearchTermAtom,
  searchTermAtom,
} from '../../store/atoms/appAtom';
import { useEffect } from 'react';

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useAtom(searchTermAtom);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useAtom(
    debouncedSearchTermAtom
  );

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
    setDebouncedSearchTerm,
  };
};
