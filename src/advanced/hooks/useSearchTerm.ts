import { useAtom } from "jotai";
import { SEARCH_DELAY } from "../constants/time";
import { useDebounce } from "../utils/hooks/useDebounce";
import { seacrhTermAtom } from "../store/atom";

export const useSearchTerm = () => {
  const [searchTerm, setSearchTerm] = useAtom(seacrhTermAtom);
  const debouncedSearchTerm = useDebounce(searchTerm, SEARCH_DELAY);

  const handleSearchTerm = (value: string) => {
    setSearchTerm(value);
  };

  return {
    searchTerm,
    debouncedSearchTerm,
    handleSearchTerm,
  };
};
