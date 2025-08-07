// TODO: 상품 관리 Hook
// 힌트:
// 1. 상품 목록 상태 관리 (localStorage 연동 고려)
// 2. 상품 CRUD 작업
// 3. 재고 업데이트
// 4. 할인 규칙 추가/삭제
//
// 반환할 값:
// - products: 상품 배열
// - updateProduct: 상품 정보 수정
// - addProduct: 새 상품 추가
// - updateProductStock: 재고 수정
// - addProductDiscount: 할인 규칙 추가
// - removeProductDiscount: 할인 규칙 삭제
import { useCallback } from "react";
import { ProductWithUI } from "../App";
import { initialProducts } from "../constants";
import { addProduct, deleteProduct, updateProduct } from "../models/product";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";
import { useNotification } from "../utils/hooks/useNotification";

export function useProducts() {
  const { addNotification } = useNotification();
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>(
    "products",
    initialProducts
  );

  const applyAddProduct = useCallback(
    (newProduct: Omit<ProductWithUI, "id">) => {
      const result = addProduct({ newProduct, products });
      if (result.success) {
        setProducts(result.newProducts);
        addNotification(result.message, "success");
      }
    },
    [addNotification]
  );

  const applyUpdateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      const result = updateProduct({ productId, updates, products });
      if (result.success) {
        setProducts(result.newProducts);
        addNotification(result.message, "success");
      }
    },
    [addNotification]
  );

  const applyDeleteProduct = useCallback(
    (productId: string) => {
      const result = deleteProduct({ productId, products });
      if (result.success) {
        setProducts(result.newProducts);
        addNotification(result.message, "success");
      }
    },
    [addNotification]
  );

  return {
    products,
    applyAddProduct,
    applyUpdateProduct,
    applyDeleteProduct,
  };
}
