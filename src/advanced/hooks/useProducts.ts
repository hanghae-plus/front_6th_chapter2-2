import { useCallback, useState, useMemo } from "react";
import { useSetAtom } from "jotai";
import { ProductWithUI } from "../types";
import { INITIAL_PRODUCTS } from "../constants";
import { SEARCH_DEBOUNCE_DELAY } from "../constants/system";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";
import { useDebounce } from "../utils/hooks/useDebounce";
import { addNotificationAtom } from "../atoms";

export function useProducts() {
  // ========== 알림 관리 (Jotai) ==========
  const addNotification = useSetAtom(addNotificationAtom);
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>(
    "products",
    INITIAL_PRODUCTS
  );

  // ========== 검색 상태 ==========
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, SEARCH_DEBOUNCE_DELAY);

  // 새 상품 추가
  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, "id">) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`,
      };
      setProducts((prev) => [...prev, product]);
      addNotification("상품이 추가되었습니다.", "success");
    },
    [addNotification, setProducts]
  );

  // 상품 정보 수정
  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, ...updates } : product
        )
      );
      addNotification("상품이 수정되었습니다.", "success");
    },
    [addNotification, setProducts]
  );

  // 상품 삭제
  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      addNotification("상품이 삭제되었습니다.", "success");
    },
    [addNotification, setProducts]
  );

  // 검색어로 필터링된 상품 목록 (내부에서 자동 계산)
  const filteredProducts = useMemo(() => {
    if (!debouncedSearchTerm) return products;

    return products.filter(
      (product) =>
        product.name
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()) ||
        (product.description &&
          product.description
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()))
    );
  }, [products, debouncedSearchTerm]);

  return {
    // ========== 상품 관리 ==========
    products,
    addProduct,
    updateProduct,
    deleteProduct,

    // ========== 검색 기능 ==========
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    filteredProducts, // 자동으로 계산된 필터링 결과
  };
}
