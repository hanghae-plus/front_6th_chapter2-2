import { useState } from 'react';
import { useDebounce } from '../utils/hooks/useDebounce';

export const useSearchTerm = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  return { searchTerm, setSearchTerm, debouncedSearchTerm };
};
