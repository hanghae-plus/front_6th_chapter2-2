import { ProductForm, ProductWithUI } from '../types';
import { validatePrice, validateStock } from '../utils/validators';

export const productService = {
  // 가격 검증 - utils에서 import
  validatePrice: (value: string) => validatePrice(value),

  // 재고 검증 - utils에서 import
  validateStock: (value: string) => validateStock(value),

  // 상품 ID 생성
  generateProductId: (): string => `p${Date.now()}`,

  // 상품 생성
  createProduct: (product: ProductForm): ProductWithUI => {
    return {
      ...product,
      id: productService.generateProductId(),
    };
  },

  // 상품 수정
  updateProductList: (
    products: ProductWithUI[],
    productId: string,
    updates: Partial<ProductWithUI>
  ): ProductWithUI[] => {
    return products.map(product =>
      product.id === productId ? { ...product, ...updates } : product
    );
  },

  // 상품 삭제
  removeProduct: (
    products: ProductWithUI[],
    productId: string
  ): ProductWithUI[] => {
    return products.filter(product => product.id !== productId);
  },
};
