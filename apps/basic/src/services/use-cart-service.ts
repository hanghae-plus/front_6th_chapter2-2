import { getRemainingStock } from '@/models/cart';
import { notificationTypeSchema } from '@/models/notification';
import { ProductView } from '@/models/product';
import { useCartStore } from '@/store';
import { useCallback } from 'react';
import { useNotificationService } from './use-notification-service';

export const useCartService = () => {
  const { addNotification } = useNotificationService();
  const cartStore = useCartStore();

  const validateCartItemQuantity = (product: ProductView) => {
    const remainingStock = getRemainingStock(product, cartStore.cart);
    if (remainingStock <= 0) {
      throw new Error('재고가 부족합니다!');
    }
  };

  const validateQuantityUpdate = (
    product: ProductView,
    newQuantity: number
  ) => {
    if (newQuantity > product.stock) {
      throw new Error(`재고는 ${product.stock}개까지만 있습니다.`);
    }
  };

  const addToCart = useCallback(
    (product: ProductView) => {
      try {
        validateCartItemQuantity(product);

        cartStore.setCart(prevCart => {
          const existingItem = cartStore.findCartItemByProductId(product.id);

          if (!existingItem) {
            return [...prevCart, { product, quantity: 1 }];
          }

          if (existingItem.quantity + 1 > product.stock) {
            addNotification(
              `재고는 ${product.stock}개까지만 있습니다.`,
              notificationTypeSchema.enum.error
            );
            return prevCart;
          }

          return prevCart.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: existingItem.quantity + 1 }
              : item
          );
        });

        addNotification('장바구니에 담았습니다');
      } catch (error) {
        if (error instanceof Error) {
          addNotification(error.message, notificationTypeSchema.enum.error);
        }
        return;
      }
    },
    [cartStore.cart, addNotification, getRemainingStock]
  );

  const removeFromCart = useCallback((productId: string) => {
    cartStore.setCart(prevCart =>
      prevCart.filter(item => item.product.id !== productId)
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number, products: ProductView[]) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      const product = products.find(p => p.id === productId);
      if (!product) return;

      try {
        validateQuantityUpdate(product, newQuantity);

        cartStore.setCart(prevCart =>
          prevCart.map(item =>
            item.product.id === productId
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
      } catch (error) {
        if (error instanceof Error) {
          addNotification(error.message, notificationTypeSchema.enum.error);
        }
      }
    },
    [removeFromCart, addNotification]
  );

  const resetCart = useCallback(() => {
    cartStore.clearCart();
  }, []);

  return {
    addToCart,
    removeFromCart,
    updateQuantity,
    resetCart,
  };
};
