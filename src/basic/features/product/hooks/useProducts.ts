import { useCallback } from "react";

import { AddNotification } from "@/basic/features/notification/types/notification";
import { productData } from "@/basic/features/product/data/product.data";
import { ProductWithUI } from "@/basic/features/product/types/product";
import { NOTIFICATION } from "@/basic/shared/constants/notification";
import { useLocalStorage } from "@/basic/shared/hooks/useLocalStorage";

interface Props {
  addNotification: AddNotification;
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
