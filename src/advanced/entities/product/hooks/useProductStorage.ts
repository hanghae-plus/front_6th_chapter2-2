import { useAtom } from "jotai";
import { productsAtom } from "../model/atoms";
import type { ProductWithUI } from "../types";

export function useProductStorage() {
  const [products, setProducts] = useAtom(productsAtom);

  const addProduct = (newProduct: Omit<ProductWithUI, "id">) => {
    const product: ProductWithUI = {
      ...newProduct,
      id: `p${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
    };
    setProducts([...products, product]);
  };

  const updateProduct = (updatedProduct: ProductWithUI) => {
    setProducts(
      products.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId));
  };

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
