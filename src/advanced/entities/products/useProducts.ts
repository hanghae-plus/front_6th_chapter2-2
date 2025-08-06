import { useCallback } from "react";
import { ProductWithUI } from "./product.types";
import { initialProducts } from "./product.constants";
import { useLocalStorageState } from "../../utils/hooks";
import { productModel } from "./product.model";
import { ActionResult } from "../../types/common";
import { MESSAGES } from "../../constants";

/**
 * 상품 상태 관리 훅
 */
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
        message: MESSAGES.SUCCESS.PRODUCT_ADDED,
        type: "success",
      };
    },
    []
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>): ActionResult => {
      const currentProducts = products;

      if (!productModel.isProductExists(currentProducts, productId)) {
        return {
          success: false,
          message: "존재하지 않는 상품입니다.",
          type: "error",
        };
      }

      setProducts((prev) =>
        productModel.updateProduct(prev, productId, updates)
      );

      return {
        success: true,
        message: MESSAGES.SUCCESS.PRODUCT_UPDATED,
        type: "success",
      };
    },
    [products]
  );

  const deleteProduct = useCallback(
    (productId: string): ActionResult => {
      const currentProducts = products;

      if (!productModel.isProductExists(currentProducts, productId)) {
        return {
          success: false,
          message: "존재하지 않는 상품입니다.",
          type: "error",
        };
      }

      setProducts((prev) => productModel.deleteProduct(prev, productId));

      return {
        success: true,
        message: MESSAGES.SUCCESS.PRODUCT_DELETED,
        type: "success",
      };
    },
    [products]
  );

  const findProduct = useCallback(
    (productId: string): ProductWithUI | undefined => {
      return productModel.findProductById(products, productId);
    },
    [products]
  );

  return {
    products,
    setProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    findProduct,
  };
};
