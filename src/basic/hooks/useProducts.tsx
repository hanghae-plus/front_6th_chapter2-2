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

import { useCallback, type Dispatch, type SetStateAction } from 'react';
import type { CartItem, Product, ProductWithUI } from '../../types';
import { initialProducts } from '../constants';
import * as productModel from '../models/product';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';

interface UseProductsReturn {
  products: ProductWithUI[];
  setProducts: Dispatch<SetStateAction<Product[]>>;
  getRemainingStock: (params: { cart: CartItem[]; product: Product }) => number;
  isSoldOut: (params: { cart: CartItem[]; product: Product }) => boolean;
}

export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useLocalStorage({
    key: 'products',
    initialValue: initialProducts,
  });

  return {
    products,
    setProducts,

    getRemainingStock: useCallback((params) => {
      return productModel.getRemainingStock(params);
    }, []),

    isSoldOut: useCallback((params) => {
      return productModel.getRemainingStock(params) <= 0;
    }, []),
  };
}
