import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";
import { useDebounce } from "../utils/hooks/useDebounce";

interface SearchContextTypes {
  searchTerm: string;
  debouncedSearchTerm: string;
}

type SearchContextActionsTypes = Dispatch<SetStateAction<string>>;

const SearchContext = createContext<SearchContextTypes>({
  searchTerm: "",
  debouncedSearchTerm: "",
});

const SearchContextActions = createContext<SearchContextActionsTypes>(() => {});

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const values = useMemo(
    () => ({
      searchTerm,
      debouncedSearchTerm,
    }),
    [searchTerm, debouncedSearchTerm]
  );

  return (
    <SearchContext.Provider value={values}>
      <SearchContextActions.Provider value={setSearchTerm}>
        {children}
      </SearchContextActions.Provider>
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }

  return context;
};

export const useSearchActions = () => {
  const context = useContext(SearchContextActions);

  if (!context) {
    throw new Error("useSearchActions must be used within a SearchProvider");
  }

  return context;
};
