import { useAtom } from "jotai";
import { useEffect } from "react";
import { debouncedSearchTermAtom, searchTermAtom } from "../atoms/searchAtoms";

export interface IUseSearchOptions {
  delay?: number;
  initialValue?: string;
}

export const useSearch = ({ delay = 500, initialValue = "" }: IUseSearchOptions = {}) => {
  const [searchTerm, setSearchTerm] = useAtom(searchTermAtom);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useAtom(debouncedSearchTermAtom);

  // 초기값 설정
  useEffect(() => {
    if (searchTerm === "" && initialValue !== "") {
      setSearchTerm(initialValue);
      setDebouncedSearchTerm(initialValue);
    }
  }, [initialValue, searchTerm, setSearchTerm, setDebouncedSearchTerm]);

  // 디바운스 처리
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, delay || 500);

    return () => clearTimeout(timer);
  }, [searchTerm, delay, 500, setDebouncedSearchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
  };
};
