import { useState, useCallback, useEffect } from 'react';
import { Product, Discount } from '../../types';
import { initialProducts } from '../constants';
import * as productModel from '../models/product';

interface UseProductsProps {
  addNotification: (message: string, type?: 'error' | 'success' | 'warning') => void;
}

export const useProducts = ({ addNotification }: UseProductsProps) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const addProduct = useCallback(
    (newProduct: Omit<Product, 'id'>) => {
      setProducts(productModel.addProduct(products, newProduct));
      addNotification('상품이 추가되었습니다.', 'success');
    },
    [products, addNotification],
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<Product>) => {
      setProducts(productModel.updateProduct(products, productId, updates));
      addNotification('상품이 수정되었습니다.', 'success');
    },
    [products, addNotification],
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts(productModel.deleteProduct(products, productId));
      addNotification('상품이 삭제되었습니다.', 'success');
    },
    [products, addNotification],
  );

  const updateProductStock = useCallback(
    (productId: string, newStock: number) => {
      setProducts(productModel.updateProductStock(products, productId, newStock));
    },
    [products],
  );

  const addProductDiscount = useCallback(
    (productId: string, newDiscount: Discount) => {
      setProducts(productModel.addProductDiscount(products, productId, newDiscount));
    },
    [products],
  );

  const removeProductDiscount = useCallback(
    (productId: string, discountQuantity: number) => {
      setProducts(productModel.removeProductDiscount(products, productId, discountQuantity));
    },
    [products],
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
