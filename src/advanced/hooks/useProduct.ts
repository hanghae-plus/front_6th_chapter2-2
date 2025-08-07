import { useCallback, useEffect, useState } from "react";
import { INITIAL_PRODUCTS } from "../constants/data";
import { ProductWithUI } from "../types/product";
import { loadDataFromStorage, saveDataToStorage } from "../utils/localStorageUtils";
import { generateProductId } from "../utils/productUtils";
import { useNotification } from "./useNotification";

export const useProduct = () => {
  /** 알림 표시 */
  const { showToast } = useNotification();

  /** 상품 현황 */
  const [products, setProducts] = useState<ProductWithUI[]>(loadDataFromStorage<ProductWithUI[]>("products", INITIAL_PRODUCTS));

  /** 상품 추가 */
  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, "id">) => {
      setProducts((prev) => [...prev, { ...newProduct, id: generateProductId() }]);
      showToast("상품이 추가되었습니다.", "success");
    },
    [showToast]
  );

  /** 상품 정보 수정 */
  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts((prev) => prev.map((product) => (product.id === productId ? { ...product, ...updates } : product)));
      showToast("상품이 수정되었습니다.", "success");
    },
    [showToast]
  );

  /** 상품 삭제 */
  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      showToast("상품이 삭제되었습니다.", "success");
    },
    [showToast]
  );

  /** localStorage 동기화 */
  useEffect(() => {
    saveDataToStorage("products", products);
  }, [products]);

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};
