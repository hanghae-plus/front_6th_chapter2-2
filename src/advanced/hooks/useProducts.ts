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

import { createContext, useCallback } from 'react'
import { initialProducts } from '../constants'
import { ProductWithUI } from '../types'
import { useLocalStorage } from '../utils/hooks/useLocalStorage'
import { getFilteredProducts as _getFilteredProducts } from '../models/product'
import { ProductContext } from '../types/context'

export const ProductsContext = createContext<ProductContext | undefined>(
  undefined,
)

export function useProducts(
  addNotification: (
    message: string,
    type?: 'error' | 'success' | 'warning',
  ) => void,
) {
  // TODO: 구현

  const [products, setProducts] = useLocalStorage<ProductWithUI[]>(
    'products',
    initialProducts,
  )

  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, 'id'>) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`,
      }
      setProducts((prev) => [...prev, product])
      addNotification('상품이 추가되었습니다.', 'success')
    },
    [addNotification, setProducts],
  )

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, ...updates } : product,
        ),
      )
      addNotification('상품이 수정되었습니다.', 'success')
    },
    [addNotification, setProducts],
  )

  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId))
      addNotification('상품이 삭제되었습니다.', 'success')
    },
    [addNotification, setProducts],
  )

  const getFilteredProducts = useCallback(
    (searchTerm: string) => {
      return _getFilteredProducts(searchTerm, products)
    },
    [products],
  )

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getFilteredProducts,
  }
}
