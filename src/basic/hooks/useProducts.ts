import { useState, useCallback } from 'react';
import { Products } from '../constants/products';
import { useNotification } from './useNotification';

// 1. 상품 목록 상태 관리 (localStorage 연동 고려)
// 2. 상품 CRUD 작업
// 3. 재고 업데이트
// 4. 할인 규칙 추가/삭제

export function useProducts() {
  const { addNotification } = useNotification();
  const [products, setProducts] = useState<typeof Products>(() => {
    const saved = localStorage.getItem('products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return Products;
      }
    }
    return Products;
  });

  // useCallback 사용 이유: 함수를 캐싱해주기 위해서 (=재정의 하지 않기 위해서)
  // 만약 Props로 updateProduct를 받아오면 함수를 재정의 하게 되어 무한 렌더링이 발생함
  // 따라서 함수를 캐싱해주기 위해 useCallback을 사용함
  // 캐싱된 함수는 렌더링 될 때마다 재정의 되지 않고 캐시된 함수를 사용함
  const updateProduct = useCallback(
    (productId: string, updates: Partial<(typeof Products)[number]>) => {
      setProducts((prev) =>
        prev.map((product) => (product.id === productId ? { ...product, ...updates } : product)),
      );
    },
    // addNotification을 의존성 배열에 추가해주는 이유:
    // 만약 addNotification을 의존성 배열에 추가하지 않으면 함수가 재정의 되어 무한 렌더링이 발생함
    // 따라서 addNotification을 의존성 배열에 추가해주어 함수가 재정의 되지 않도록 함

    // addNotification도 useCallback으로 캐싱되어있는데 여기서 의존성으로 넣어줄 필요가 있나?
    [addNotification],
  );

  const addProduct = useCallback(
    (newProduct: Omit<(typeof Products)[number], 'id'>) => {
      const product: (typeof Products)[number] = {
        ...newProduct,
        id: `p${Date.now()}`,
      };
      setProducts((prev) => [...prev, product]);
      addNotification('상품이 추가되었습니다.', 'success');
    },
    [addNotification],
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      addNotification('상품이 삭제되었습니다.', 'success');
    },
    [addNotification],
  );

  return {
    products,
    updateProduct,
    addProduct,
    deleteProduct,
  };
}
