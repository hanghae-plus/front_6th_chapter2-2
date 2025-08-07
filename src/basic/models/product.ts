import { ProductWithUI } from '../shared/types';

/**
 * 상품 추가 로직
 * @param newProduct - 추가할 상품
 */
export const addProduct = (products: ProductWithUI[], newProduct: Omit<ProductWithUI, 'id'>) => {
  const product: ProductWithUI = {
    ...newProduct,
    id: `p${Date.now()}`,
  };
  return [...products, product];
};

/**
 * 상품 수정 로직
 * @param productId - 상품 ID
 * @param updates - 수정할 상품 정보
 */
export const updateProduct = (products: ProductWithUI[], productId: string, updates: Partial<ProductWithUI>) => {
  return products.map((product) => (product.id === productId ? { ...product, ...updates } : product));
};

/**
 * 상품 삭제 로직
 * @param productId - 상품 ID
 */
export const deleteProduct = (products: ProductWithUI[], productId: string) => {
  return products.filter((p) => p.id !== productId);
};
