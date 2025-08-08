import { useAtomValue } from "jotai";
import { productsAtom } from "../stores/productStore";
import { filterSearchTermByProduct } from "../models/product";
import { useSearch } from "../utils/hooks/useSearch";

export const useProductSearch = () => {
  const products = useAtomValue(productsAtom);
  return useSearch(products, filterSearchTermByProduct);
};
