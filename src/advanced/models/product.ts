import { Product } from "../../types";

const productModel = {
  createProduct: <T>(newProduct: T) => {
    const product: T & { id: string } = {
      ...newProduct,
      id: `p${Date.now()}`,
    };
    return product;
  },

  updateItem: ({
    products,
    productId,
    updates,
  }: {
    products: Product[];
    productId: string;
    updates: Partial<Product>;
  }): Product[] => {
    return products.map((product) =>
      product.id === productId ? { ...product, ...updates } : product
    );
  },

  removeItem: ({
    products,
    productId,
  }: {
    products: Product[];
    productId: string;
  }): Product[] => products.filter((item) => item.id !== productId),

  findItem: ({
    products,
    productId,
  }: {
    products: Product[];
    productId: string;
  }): Product | undefined => products.find((item) => item.id === productId),
};

export default productModel;
