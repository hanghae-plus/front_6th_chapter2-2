import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { searchQueryAtom, debouncedSearchQueryAtom } from '../../atoms/searchAtom';

export const useSearch = () => {
  const [query, setQuery] = useAtom(searchQueryAtom);
  const [debouncedQuery, setDebouncedQuery] = useAtom(debouncedSearchQueryAtom);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query, setDebouncedQuery]);

  return {
    query,
    setQuery,
    debouncedQuery,
  };
};
