import { useCallback } from "react";
import { useAtom } from "jotai";
import { productsAtom } from "../atoms/productAtom";
import { ProductWithUI } from "../App";
import productService from "../services/product";
import { useNotification } from "./useNotification";

export function useProduct() {
  const [products, setProducts] = useAtom(productsAtom);
  const { addNotification } = useNotification();

  // 액션 함수들
  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, "id">) => {
      const result = productService.addNewItem({
        products,
        product: newProduct,
      });

      if (result.status === "success") {
        setProducts(result.value);
        addNotification("상품이 추가되었습니다.", "success");
      } else {
        addNotification(result.message, "error");
      }

      return result;
    },
    [products, setProducts, addNotification]
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      const result = productService.updateProduct({
        products,
        productId,
        updates,
      });

      if (result.status === "success") {
        setProducts(result.value);
        addNotification("상품이 수정되었습니다.", "success");
      } else {
        addNotification(result.message, "error");
      }

      return result;
    },
    [products, setProducts, addNotification]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      const result = productService.deleteProduct({
        products,
        productId,
      });

      if (result.status === "success") {
        setProducts(result.value);
        addNotification("상품이 삭제되었습니다.", "success");
      } else {
        addNotification(result.message, "error");
      }

      return result;
    },
    [products, setProducts, addNotification]
  );

  const searchProduct = useCallback(
    (searchTerm: string) => {
      return productService.searchProduct({
        products,
        searchTerm,
      });
    },
    [products]
  );

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    searchProduct,
  };
}
