import { useAtom } from "jotai";
import { searchTermAtom } from "../../atoms";
import { useDebounce } from "../../utils/hooks";

export const useSearchProduct = () => {
  const [searchTerm, setSearchTerm] = useAtom(searchTermAtom);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  return { searchTerm, handleSearch, debouncedSearchTerm };
};
