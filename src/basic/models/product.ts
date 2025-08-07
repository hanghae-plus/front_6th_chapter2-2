import { IProductWithUI } from "../type";

export const productModel = {
  /**
   * 상품 추가
   */
  addProduct: (
    products: IProductWithUI[],
    newProduct: Omit<IProductWithUI, "id">
  ): IProductWithUI[] => {
    const product: IProductWithUI = {
      ...newProduct,
      id: `p${Date.now()}`, // 상품 고유 아이디
    };

    return [...products, product];
  },

  /**
   * 상품 수정
   */
  updateProduct: (
    products: IProductWithUI[],
    productId: string,
    updates: Partial<IProductWithUI>
  ): IProductWithUI[] => {
    return products.map((product) =>
      product.id === productId ? { ...product, ...updates } : product
    );
  },

  /**
   * 상품 삭제
   */
  deleteProduct: (
    products: IProductWithUI[],
    productId: string
  ): IProductWithUI[] => {
    return products.filter((product) => product.id !== productId);
  },
};
