import { useAtom, useSetAtom } from "jotai";
import { Product } from "../../types";
import { useAutoCallback } from "../utils/hooks/useAutoCallbak";
import { withTryNotifySuccess } from "../utils/withNotify";
import { productsAtom, addProductAtom, updateProductAtom, deleteProductAtom } from "../stores/productStore";

export const useProducts = (addNotification?: (message: string, type?: "error" | "success" | "warning") => void) => {
  const [products] = useAtom(productsAtom);

  const addProductSet = useSetAtom(addProductAtom);
  const updateProductSet = useSetAtom(updateProductAtom);
  const deleteProductSet = useSetAtom(deleteProductAtom);

  const addProduct = (newProduct: Omit<Product, "id">) => {
    addProductSet(newProduct);
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    updateProductSet({ productId, updates });
  };

  const deleteProduct = (productId: string) => {
    deleteProductSet(productId);
  };

  const handleAddProduct = useAutoCallback(
    withTryNotifySuccess(addProduct, "상품이 추가되었습니다.", addNotification ?? (() => {}))
  );

  const handleUpdateProduct = useAutoCallback(
    withTryNotifySuccess(updateProduct, "상품이 수정되었습니다.", addNotification ?? (() => {}))
  );

  const handleDeleteProduct = useAutoCallback(
    withTryNotifySuccess(deleteProduct, "상품이 삭제되었습니다.", addNotification ?? (() => {}))
  );

  return {
    products,
    addProduct: handleAddProduct,
    updateProduct: handleUpdateProduct,
    deleteProduct: handleDeleteProduct,
  };
};
