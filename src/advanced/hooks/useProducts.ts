import { ProductWithUI } from "../../types";
import { initialProducts } from "../constants";
import { useLocalStorageState } from "../utils/hooks/useLocalStorageState";

export const useProducts = () => {
  const [products, setProducts] = useLocalStorageState<Array<ProductWithUI>>(
    "products",
    initialProducts
  );
  const addProduct = (newProduct: Omit<ProductWithUI, "id">) => {
    const product: ProductWithUI = {
      ...newProduct,
      id: `p${Date.now()}`,
    };
    setProducts((prev) => [...prev, product]);
  };

  const updateProduct = (
    productId: string,
    updates: Partial<ProductWithUI>
  ) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId ? { ...product, ...updates } : product
      )
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  return {
    products,
    addProduct,
    deleteProduct,
    updateProduct,
  };
};
