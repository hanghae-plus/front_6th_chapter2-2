import { useCallback } from 'react';
import { initialProducts, ProductWithUI } from '../datas/products';
import { useSyncedLocalStorage } from '../utils/hooks/useSyncedLocalStorage';

export const useProducts = () => {
  const [products, setProducts] = useSyncedLocalStorage<ProductWithUI[]>('products', initialProducts);

  //판매상품에 새 상품을 추가
  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, 'id'>) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`
      };
      setProducts(prev => [...prev, product]);
    },
    [setProducts]
  );

  // 판매상품 정보 수정
  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts(prev => prev.map(product => (product.id === productId ? { ...product, ...updates } : product)));
    },
    [setProducts]
  );

  // 판매상품 삭제
  const deleteProduct = useCallback(
    (productId: string) => setProducts(prev => prev.filter(p => p.id !== productId)),
    [setProducts]
  );

  return { products, addProduct, updateProduct, deleteProduct };
};
