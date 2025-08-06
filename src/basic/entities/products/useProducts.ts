import { useCallback } from "react";
import { ProductWithUI } from "./product.types";
import { initialProducts } from "./product.constants";
import { useLocalStorageState } from "../../utils/hooks";
import { productModel } from "./product.model";
import { ActionResult } from "../../types/common";

export const useProducts = () => {
  const [products, setProducts] = useLocalStorageState<ProductWithUI[]>(
    "products",
    initialProducts
  );

  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, "id">): ActionResult => {
      setProducts((prev) => productModel.addProduct(prev, newProduct));
      return {
        success: true,
        message: "상품이 추가되었습니다.",
        type: "success",
      };
    },
    []
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>): ActionResult => {
      setProducts((prev) =>
        productModel.updateProduct(prev, productId, updates)
      );
      return {
        success: true,
        message: "상품이 수정되었습니다.",
        type: "success",
      };
    },
    []
  );

  const deleteProduct = useCallback((productId: string): ActionResult => {
    setProducts((prev) => productModel.deleteProduct(prev, productId));
    return {
      success: true,
      message: "상품이 삭제되었습니다.",
      type: "success",
    };
  }, []);

  return {
    products,
    setProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};
