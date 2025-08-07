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
