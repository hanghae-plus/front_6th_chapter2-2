import { Product } from '../../types';

interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

export const useProduct = (
  setProducts: React.Dispatch<React.SetStateAction<ProductWithUI[]>>,
  addNotification: (message: string, type: 'success' | 'error' | 'warning') => void
) => {
  const addProduct = (productData: Omit<ProductWithUI, 'id'>) => {
    const newProduct = {
      id: `p${Date.now()}`,
      ...productData,
    };
    setProducts((prev) => [...prev, newProduct]);
    addNotification('상품이 추가되었습니다.', 'success');
  };

  const updateProduct = (productId: string, productData: Omit<ProductWithUI, 'id'>) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              ...productData,
            }
          : p
      )
    );
    addNotification('상품이 수정되었습니다.', 'success');
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    addNotification('상품이 삭제되었습니다.', 'warning');
  };

  return { addProduct, updateProduct, deleteProduct };
};
