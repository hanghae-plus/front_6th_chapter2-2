// TODO: 상품 관리 Hook
// 힌트:
// 1. 상품 목록 상태 관리 (localStorage 연동 고려)
// 2. 상품 CRUD 작업
// 3. 재고 업데이트
// 4. 할인 규칙 추가/삭제
//
// 반환할 값:
// - products: 상품 배열 !
// - updateProduct: 상품 정보 수정 !
// - addProduct: 새 상품 추가 !
// - updateProductStock: 재고 수정
// - addProductDiscount: 할인 규칙 추가
// - removeProductDiscount: 할인 규칙 삭제

import { IProductWithUI } from "../type";
import { initialProducts } from "../constants/initialStates";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";
import { productModel } from "../models/product";

export const useProducts = () => {
  // 로컬스토리지 연동된 products
  const [products, setProducts] = useLocalStorage<IProductWithUI[]>(
    "products",
    initialProducts
  );

  /**
   * 상품 추가
   */
  const addProduct = (newProduct: Omit<IProductWithUI, "id">) => {
    setProducts((prev) => productModel.addProduct(prev, newProduct));
  };

  /**
   * 상품 수정
   */
  const updateProduct = (
    productId: string,
    updates: Partial<IProductWithUI>
  ) => {
    setProducts((prev) => productModel.updateProduct(prev, productId, updates));
  };

  /**
   * 상품 삭제
   */
  const deleteProduct = (productId: string) => {
    setProducts((prev) => productModel.deleteProduct(prev, productId));
  };

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};
