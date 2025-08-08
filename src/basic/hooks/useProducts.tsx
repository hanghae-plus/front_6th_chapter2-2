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
import type { Notify, Product, ProductWithUI } from '../../types';
import { initialProducts } from '../constants';
import * as productModel from '../models/product';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';

interface UseProductsParams {
  notify: Notify;
}

interface UseProductsReturn {
  products: ProductWithUI[];
  setProducts: Dispatch<SetStateAction<Product[]>>;
  addProduct: (params: { newProduct: Omit<ProductWithUI, 'id'> }) => void;
  updateProduct: (params: {
    productId: string;
    updates: Partial<ProductWithUI>;
  }) => void;
  deleteProduct: (params: { productId: string }) => void;
}

export function useProducts({ notify }: UseProductsParams): UseProductsReturn {
  const [products, setProducts] = useLocalStorage({
    key: 'products',
    initialValue: initialProducts,
  });

  return {
    products,
    setProducts,

    addProduct: useCallback(
      (params) => {
        setProducts((prevProducts) => {
          return productModel.addProduct({
            id: `p${Date.now()}`,
            newProduct: params.newProduct,
            products: prevProducts,
            onSuccess: () => {
              notify({
                message: '상품이 추가되었습니다.',
                type: 'success',
              });
            },
          });
        });
      },
      [setProducts, notify]
    ),

    updateProduct: useCallback(
      ({ productId, updates }) => {
        setProducts((prevProducts) => {
          return productModel.updateProduct({
            productId,
            updates,
            products: prevProducts,
            onSuccess: () => {
              notify({
                message: '상품이 수정되었습니다.',
                type: 'success',
              });
            },
          });
        });
      },
      [setProducts, notify]
    ),

    deleteProduct: useCallback(
      ({ productId }) => {
        setProducts((prevProducts) => {
          return productModel.deleteProduct({
            productId,
            products: prevProducts,
            onSuccess: () => {
              notify({
                message: '상품이 삭제되었습니다.',
                type: 'success',
              });
            },
          });
        });
      },
      [setProducts, notify]
    ),
  };
}
