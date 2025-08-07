import { useCallback } from "react";
import { Product } from "@/types";
import {
  useGlobalNotification,
  NotificationVariant,
} from "@entities/notification";

interface UseUpdateCartQuantityOptions {
  products: Product[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export function useUpdateCartQuantity({
  products,
  onUpdateQuantity,
}: UseUpdateCartQuantityOptions) {
  const { addNotification } = useGlobalNotification();

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        onUpdateQuantity(productId, 0);
        return;
      }

      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const maxStock = product.stock;
      if (newQuantity > maxStock) {
        addNotification(
          `재고는 ${maxStock}개까지만 있습니다.`,
          NotificationVariant.ERROR
        );
        return;
      }

      onUpdateQuantity(productId, newQuantity);
    },
    [products, onUpdateQuantity, addNotification]
  );

  return {
    updateQuantity,
  };
}
