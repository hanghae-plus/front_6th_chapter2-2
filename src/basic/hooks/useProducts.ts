import { initialProducts } from "../data/products";
import type { ProductWithUI } from "../ProductWithUI";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";

export function useProducts() {
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>(
    "products",
    initialProducts
  );

  return { products, setProducts };
}