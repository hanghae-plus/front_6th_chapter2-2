import { useAtom } from 'jotai';
import { useDebounce } from '../utils/hooks/useDebounce';
import { seacrhTermAtom } from '../store/atoms';

export const useSearchTerm = () => {
  const [searchTerm, setSearchTerm] = useAtom(seacrhTermAtom);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const handleSearchTerm = (value: string) => {
    setSearchTerm(value);
  };

  return { searchTerm, handleSearchTerm, debouncedSearchTerm };
};
