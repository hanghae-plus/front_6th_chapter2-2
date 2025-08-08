import { initialProducts } from "../data/products"
import type { ProductViewModel } from "../entities/ProductViewModel.ts"
import { useLocalStorage } from "../utils/hooks/useLocalStorage"

export function useProducts() {
  const [products, setProducts] = useLocalStorage<ProductViewModel[]>("products", initialProducts)

  return { products, setProducts }
}
