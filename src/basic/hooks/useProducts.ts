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

// products,setProducts사용 되는 로직 다 몰아넣는게 엔티티 분리일까 ?
// -_-

import { useEffect } from 'react';

import { ProductWithUI } from '../App';
import { initialProducts } from '../constants';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';

export function useProducts() {
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>('products', initialProducts);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  return {
    products,
    setProducts,
  };
}
