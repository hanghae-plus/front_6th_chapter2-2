import { useCallback, useEffect, useState } from 'react';
import { ProductWithUI } from '../App.tsx';
import { useNotifications } from './useNotifications.ts';

const initialProducts: ProductWithUI[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.1 },
      { quantity: 20, rate: 0.2 },
    ],
    description: '최고급 품질의 프리미엄 상품입니다.',
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }],
    description: '다양한 기능을 갖춘 실용적인 상품입니다.',
    isRecommended: true,
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.2 },
      { quantity: 30, rate: 0.25 },
    ],
    description: '대용량과 고성능을 자랑하는 상품입니다.',
  },
];

export const useProducts = () => {
  const { addNotification } = useNotifications();
  const [products, setProducts] = useState<ProductWithUI[]>(() => {
    const saved = localStorage.getItem('products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialProducts;
      }
    }
    return initialProducts;
  });

  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, 'id'>) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`,
      };
      setProducts(prev => [...prev, product]);
      addNotification('상품이 추가되었습니다.', 'success');
    },
    [addNotification]
  );
  // 상품 수정
  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts(prev =>
        prev.map(product =>
          product.id === productId ? { ...product, ...updates } : product
        )
      );
      addNotification('상품이 수정되었습니다.', 'success');
    },
    [addNotification]
  );
  // 상품 삭제
  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts(prev => prev.filter(p => p.id !== productId));
      addNotification('상품이 삭제되었습니다.', 'success');
    },
    [addNotification]
  );

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  return { products, addProduct, updateProduct, deleteProduct };
};
