import { useCallback } from 'react';
import { useLocalStorage } from '../shared/hooks';
import { ProductWithUI } from '../shared/types';
import { productModel } from '../models/product';
import { initialProducts } from '../shared/constants';

export function useProducts() {
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>('products', initialProducts);

  /**
   * 상품 추가
   * @param newProduct - 추가할 상품
   * @param onSuccess - 성공 콜백
   */
  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, 'id'>, onSuccess?: (message: string) => void) => {
      const updatedProducts = productModel.addProduct(products, newProduct);
      setProducts(updatedProducts);
      onSuccess?.('상품이 추가되었습니다.');
    },
    [products, setProducts],
  );

  /**
   * 상품 수정
   * @param productId - 상품 ID
   * @param updates - 수정할 상품 정보
   * @param onSuccess - 성공 콜백
   */
  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>, onSuccess?: (message: string) => void) => {
      const updatedProducts = productModel.updateProduct(products, productId, updates);
      setProducts(updatedProducts);
      onSuccess?.('상품이 수정되었습니다.');
    },
    [products, setProducts],
  );

  /**
   * 상품 삭제
   * @param productId - 상품 ID
   * @param onSuccess - 성공 콜백
   */
  const deleteProduct = useCallback(
    (productId: string, onSuccess?: (message: string) => void) => {
      const updatedProducts = productModel.deleteProduct(products, productId);
      setProducts(updatedProducts);
      onSuccess?.('상품이 삭제되었습니다.');
    },
    [products, setProducts],
  );

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
