import { useCallback } from 'react';

import { Product, Discount } from '../../types';
import { initialProducts } from '../constants';
import * as discountModel from '../models/discount';
import * as productModel from '../models/product';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';

interface UseProductsProps {
  addNotification: (message: string, type?: 'error' | 'success' | 'warning') => void;
}

export const useProducts = ({ addNotification }: UseProductsProps) => {
  const [products, setProducts] = useLocalStorage<Product[]>('products', initialProducts);

  const addProduct = useCallback(
    (newProduct: Omit<Product, 'id'>) => {
      setProducts((prevProducts) => productModel.addProduct(prevProducts, newProduct));
      addNotification('상품이 추가되었습니다.', 'success');
    },
    [setProducts, addNotification],
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<Product>) => {
      setProducts((prevProducts) => productModel.updateProduct(prevProducts, productId, updates));
      addNotification('상품이 수정되었습니다.', 'success');
    },
    [setProducts, addNotification],
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prevProducts) => productModel.deleteProduct(prevProducts, productId));
      addNotification('상품이 삭제되었습니다.', 'success');
    },
    [setProducts, addNotification],
  );

  const updateProductStock = useCallback(
    (productId: string, newStock: number) => {
      setProducts((prevProducts) =>
        productModel.updateProductStock(prevProducts, productId, newStock),
      );
    },
    [setProducts],
  );

  const addProductDiscount = useCallback(
    (productId: string, newDiscount: Discount) => {
      setProducts((prevProducts) =>
        discountModel.addProductDiscount(prevProducts, productId, newDiscount),
      );
    },
    [setProducts],
  );

  const removeProductDiscount = useCallback(
    (productId: string, discountQuantity: number) => {
      setProducts((prevProducts) =>
        discountModel.removeProductDiscount(prevProducts, productId, discountQuantity),
      );
    },
    [setProducts],
  );

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
    addProductDiscount,
    removeProductDiscount,
  };
};
