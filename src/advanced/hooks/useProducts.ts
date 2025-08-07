import { useAtom, useSetAtom } from "jotai";
import { Product } from "../../types";
import { useAutoCallback } from "../utils/hooks/useAutoCallbak";
import { withTryNotifySuccess } from "../utils/withNotify";
import { productsAtom, addProductAtom, updateProductAtom, deleteProductAtom } from "../stores/productStore";

// 라이브러리 훅을 래핑하는 엔티티 Hook
export const useProducts = (addNotification?: (message: string, type?: "error" | "success" | "warning") => void) => {
  // Jotai 라이브러리 훅들을 래핑
  const [products] = useAtom(productsAtom);

  const addProductSet = useSetAtom(addProductAtom);
  const updateProductSet = useSetAtom(updateProductAtom);
  const deleteProductSet = useSetAtom(deleteProductAtom);

  // 엔티티 특화 로직으로 래핑
  const addProduct = (newProduct: Omit<Product, "id">) => {
    addProductSet(newProduct);
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    updateProductSet({ productId, updates });
  };

  const deleteProduct = (productId: string) => {
    deleteProductSet(productId);
  };

  // 엔티티 특화 에러 처리와 알림 로직
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
