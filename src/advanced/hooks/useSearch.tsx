import { useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';
import { debouncedSearchAtom, setDebouncedSearchAtom } from '../atoms/search';
import { useSetDebounce } from '../utils/hooks/useDebounce';

export function useSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const setDebouncedSearch = useSetDebouncedSearch();
  useSetDebounce({
    delay: 500,
    value: searchTerm,
    setValue: setDebouncedSearch,
  });

  return { searchTerm, setSearchTerm };
}

export function useDebouncedSearch() {
  return useAtomValue(debouncedSearchAtom);
}

export function useSetDebouncedSearch() {
  return useSetAtom(setDebouncedSearchAtom);
}
