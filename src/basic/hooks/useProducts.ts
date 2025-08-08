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

import { useEffect, useState } from 'react';

import { ProductWithUI } from '../../types';
import { initialProducts } from '../constants';

export function useProducts() {
  // TODO: 구현
  const [products, setProducts] = useState<ProductWithUI[]>(() => {
    const saved = localStorage.getItem('products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return initialProducts;
  });

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const updateProduct = (
    productId: string,
    updates: Partial<ProductWithUI>,
    onSuccess?: () => void,
  ) => {
    setProducts((prev) =>
      prev.map((product) => (product.id === productId ? { ...product, ...updates } : product)),
    );
    onSuccess?.();
  };

  const addProduct = (newProduct: Omit<ProductWithUI, 'id'>, onSuccess?: () => void) => {
    const product: ProductWithUI = {
      ...newProduct,
      id: `p${Date.now()}`,
    };
    setProducts((prev) => [...prev, product]);
    onSuccess?.();
  };

  const deleteProduct = (productId: string, onSuccess?: () => void) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    onSuccess?.();
  };

  const updateProductStock = (productId: string, newStock: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId ? { ...product, stock: newStock } : product,
      ),
    );
  };

  const addProductDiscount = (productId: string, discount: { quantity: number; rate: number }) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, discounts: [...(product.discounts || []), discount] }
          : product,
      ),
    );
  };

  const removeProductDiscount = (productId: string, discountIndex: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? {
              ...product,
              discounts: product.discounts?.filter((_, index) => index !== discountIndex),
            }
          : product,
      ),
    );
  };

  return {
    products,
    updateProduct,
    addProduct,
    deleteProduct,
    updateProductStock,
    addProductDiscount,
    removeProductDiscount,
  };
}
