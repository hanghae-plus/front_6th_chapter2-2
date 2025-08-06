import { initialProducts } from "../data/products";
import type { ProductWithUI } from "../entities/ProductWithUI.ts";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";

export function useProducts() {
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>(
    "products",
    initialProducts
  );

  return { products, setProducts };
}