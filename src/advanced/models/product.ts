import { ProductWithUI } from "../App";

const addProduct = ({
  newProduct,
  products,
}: {
  newProduct: Omit<ProductWithUI, "id">;
  products: ProductWithUI[];
}) => {
  const addProduct = {
    ...newProduct,
    id: `p${Date.now()}`,
  };

  return {
    success: true,
    newProducts: [...products, addProduct],
    message: "상품이 추가되었습니다.",
  };
};

const updateProduct = ({
  productId,
  updates,
  products,
}: {
  productId: string;
  updates: Partial<ProductWithUI>;
  products: ProductWithUI[];
}) => {
  const newProducts = products.map((product) =>
    product.id === productId ? { ...product, ...updates } : product
  );

  return {
    success: true,
    newProducts,
    message: "상품이 수정되었습니다.",
  };
};

const deleteProduct = ({
  productId,
  products,
}: {
  productId: string;
  products: ProductWithUI[];
}) => {
  const newProducts = products.filter((product) => product.id !== productId);

  return {
    success: true,
    newProducts,
    message: "상품이 삭제되었습니다.",
  };
};

export { addProduct, updateProduct, deleteProduct };
