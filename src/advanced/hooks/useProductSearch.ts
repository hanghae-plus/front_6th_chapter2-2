import { useAtomValue } from "jotai";
import { productsAtom } from "../stores/productStore";
import { searchProducts } from "../models/product";
import { useSearch } from "../utils/hooks/useSearch";

export const useProductSearch = () => {
  const products = useAtomValue(productsAtom);
  return useSearch(products, searchProducts);
};
