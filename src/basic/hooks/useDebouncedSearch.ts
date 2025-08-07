import { useState } from 'react';

import { useDebounce } from '../utils/hooks/useDebounce';

export function useDebouncedSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const handleChangeSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return { searchTerm, debouncedSearchTerm, handleChangeSearchTerm };
}
