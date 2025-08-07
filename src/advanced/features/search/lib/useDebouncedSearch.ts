import { useState } from 'react';

import { useDebounce } from '../../../shared/hooks';

export function useDebouncedSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const handleChangeSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return [searchTerm, debouncedSearchTerm, handleChangeSearchTerm] as const;
}
