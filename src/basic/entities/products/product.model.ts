import { ProductWithUI } from "./product.types";

export const productModel = {
  /**
   * 상품 추가
   */
  addProduct: (
    products: ProductWithUI[],
    newProduct: Omit<ProductWithUI, "id">
  ): ProductWithUI[] => {
    const product: ProductWithUI = {
      ...newProduct,
      id: `p${Date.now()}`, // 상품 고유 아이디
    };

    return [...products, product];
  },

  /**
   * 상품 수정
   */
  updateProduct: (
    products: ProductWithUI[],
    productId: string,
    updates: Partial<ProductWithUI>
  ): ProductWithUI[] => {
    return products.map((product) =>
      product.id === productId ? { ...product, ...updates } : product
    );
  },

  /**
   * 상품 삭제
   */
  deleteProduct: (
    products: ProductWithUI[],
    productId: string
  ): ProductWithUI[] => {
    return products.filter((product) => product.id !== productId);
  },
};
