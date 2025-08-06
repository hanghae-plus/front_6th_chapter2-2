import { useCallback } from "react";

import { NOTIFICATION } from "@/basic/constants";
import { productData } from "@/basic/data";
import { useLocalStorage } from "@/basic/hooks";
import { NotificationType, ProductWithUI } from "@/types";

interface Props {
  addNotification: (message: string, type: NotificationType) => void;
}

export function useProducts({ addNotification }: Props) {
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>(
    "products",
    productData.initialProducts
  );

  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, "id">) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`,
      };
      setProducts((prev) => [...prev, product]);
      addNotification("상품이 추가되었습니다.", NOTIFICATION.TYPES.SUCCESS);
    },
    [addNotification]
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, ...updates } : product
        )
      );
      addNotification("상품이 수정되었습니다.", NOTIFICATION.TYPES.SUCCESS);
    },
    [addNotification]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      addNotification("상품이 삭제되었습니다.", NOTIFICATION.TYPES.SUCCESS);
    },
    [addNotification]
  );

  return { products, addProduct, updateProduct, deleteProduct };
}
